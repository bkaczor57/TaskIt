using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.Repository;
using TaskIt.Server.Requests;
using TaskIt.Server.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly ISectionService _sectionService;
    private readonly IUserService _userService;
    private readonly IUserTeamService _userTeamService;
    private readonly IServiceHelper _serviceHelper;

    public TaskService(ITaskRepository taskRepository, ISectionService sectionService, IUserService userService, IUserTeamService userTeamService, IServiceHelper serviceHelper)
    {
        _taskRepository = taskRepository;
        _sectionService = sectionService;
        _userService = userService;
        _userTeamService = userTeamService;
        _serviceHelper = serviceHelper;
    }

    public async Task<ServiceResult<TaskDTO>> GetTaskByIdAsync(int taskId, bool includeTeam)
    {
        // pobieranie taska z repozytorium, opcjonalnie z wczytaniem zespołu
        var taskEntity = await _taskRepository.GetByIdAsync(
            taskId,
            includeSection: true,
            includeAssignedUser: true,
        includeTeam: includeTeam
        );

        if (taskEntity == null)
            return ServiceResult<TaskDTO>.Fail("Team not found");

        // Mapowanie DTO
        return ServiceResult<TaskDTO>.Ok(MapToDto(taskEntity));
    }

    public async Task<ServiceResult<PagedResult<TaskDTO>>> GetTasksFilteredAsync(TasksQueryRequest request)
    {
       
        // Lazy loading
        var query = _taskRepository.GetAllQueryable();

        // Include sekcji i Assigned User - zawsze je pobieramy. Metoda wykorzystywana w poborze danych wewnątrz section oraz teamID
        query = query.Include(t => t.Section)
                     .Include(t => t.AssignedUser);
        // Opcjonalny pobór zespołu w konkretnych przypadkach - całkowicie opcjonalne
        if (request.IncludeTeam)
        {
            query = query.Include(t => t.Section.Team);
        }

        // filtrowanie 
        if (request.AssignedUserId.HasValue)
        {
            query = query.Where(t => t.AssignedUserId == request.AssignedUserId.Value);
        }
        if (request.SectionId.HasValue)
        {
            query = query.Where(t => t.SectionId == request.SectionId.Value);
        }
        if (request.TeamId.HasValue)
        {
            query = query.Where(t => t.Section.TeamId == request.TeamId.Value);
        }
        if (request.Status.HasValue)
        {
            query = query.Where(t => t.Status == request.Status.Value);
        }
        if (request.Priority.HasValue)
        {
            query = query.Where(t => t.Priority == request.Priority.Value);
        }
        if (request.DueBefore.HasValue && request.TimeZoneOffsetInMinutes.HasValue)
        {
            var dueBeforeUtc = AdjustToUtc(request.DueBefore, request.TimeZoneOffsetInMinutes);
            query = query.Where(t => t.DueDate <= dueBeforeUtc.Value);
        }

        if (request.DueAfter.HasValue && request.TimeZoneOffsetInMinutes.HasValue)
        {
            var dueAfterUtc = AdjustToUtc(request.DueAfter, request.TimeZoneOffsetInMinutes);
            query = query.Where(t => t.DueDate >= dueAfterUtc.Value);
        }

        if (request.CreatedBefore.HasValue && request.TimeZoneOffsetInMinutes.HasValue)
        {
            var createdBeforeUtc = AdjustToUtc(request.CreatedBefore, request.TimeZoneOffsetInMinutes);
            query = query.Where(t => t.CreatedAt <= createdBeforeUtc.Value);
        }

        if (request.CreatedAfter.HasValue && request.TimeZoneOffsetInMinutes.HasValue)
        {
            var createdAfterUtc = AdjustToUtc(request.CreatedAfter, request.TimeZoneOffsetInMinutes);
            query = query.Where(t => t.CreatedAt >= createdAfterUtc.Value);
        }
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(t => t.Title.Contains(request.SearchTerm)
                                  || t.Description.Contains(request.SearchTerm));
        }

        // Sortowanie - wybór konkretnej kolumny do sortowania oraz kierunku sortowania
        query = SortTasks(query, request.OrderBy, request.Ascending);

        // pobór danych przed paginacją - może być wykorzystywany nawet bez paginacji w celu określenia ilości tasków w teamie 
        // bez konieczności wykonywania metody CountTasksByAssignedUserAsync
        // - przydatne ponieważ nie musimy wykonywać dwóch zapytań do bazy we frontendzie
        var totalCount = await query.CountAsync();

        // Paginacja 
        if (request.PageNumber.HasValue && request.PageNumber > 0
            && request.PageSize.HasValue && request.PageSize > 0)
        {
           
            query = query.Skip((request.PageNumber.Value - 1) * request.PageSize.Value)
                         .Take(request.PageSize.Value);
        }


        // Pobranie danych i zmapowanie na DTO
        var tasks = await query.ToListAsync();
        var taskDtos = tasks.Select(MapToDto).ToList();

        var pagedResult = new PagedResult<TaskDTO>
        {
            Items = taskDtos,
            TotalItems = totalCount,
            TotalPages = request.PageSize.HasValue && request.PageSize.Value > 0
               ? (int)Math.Ceiling(totalCount / (double)request.PageSize.Value)
               : 1,
            CurrentPage = request.PageNumber ?? 1
        };
        return ServiceResult<PagedResult<TaskDTO>>.Ok(pagedResult);
    }

    public async Task<ServiceResult<PagedResult<TaskDTO>>> GetUserTasksWithSearchAsync(int userId, TasksUserQueryRequest request)
    {
        // W tym miejscu chcemy juz pobierać również teamy - user musi wiedzieć do jakiego zespołu należy dane zadanie
        var query = _taskRepository.GetAllQueryable()
            .Include(t => t.Section)
            .ThenInclude(s => s.Team)
            .Include(t => t.AssignedUser)
            .Where(t => t.AssignedUserId == userId);

        // Filtrowanie
        if (request.Status.HasValue)
        {
            query = query.Where(t => t.Status == request.Status.Value);
        }
        if (request.Priority.HasValue)
        {
            query = query.Where(t => t.Priority == request.Priority.Value);
        }
        if (request.TeamIds != null && request.TeamIds.Any())
        {
            query = query.Where(t => request.TeamIds.Contains(t.Section.TeamId));
        }

        // Wyszukiwanie
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchLower = request.SearchTerm.ToLower();
            query = query.Where(t =>
                (t.Title != null && t.Title.ToLower().Contains(searchLower)) ||
                (t.Description != null && t.Description.ToLower().Contains(searchLower)) ||
                (t.Section.Team != null && t.Section.Team.Name != null
                    && t.Section.Team.Name.ToLower().Contains(searchLower))
            );
        }

        // Sortowanie
        query = SortTasks(query, request.OrderBy, request.Ascending);

        // Licznik
        var totalCount = await query.CountAsync();

        // Paginacja
        if (request.PageNumber.HasValue && request.PageNumber > 0
            && request.PageSize.HasValue && request.PageSize > 0)
        {
            query = query.Skip((request.PageNumber.Value - 1) * request.PageSize.Value)
                         .Take(request.PageSize.Value);
        }



        var tasks = await query.ToListAsync();
        var dtos = tasks.Select(MapToDto).ToList();

        var pagedResult = new PagedResult<TaskDTO>
        {
            Items = dtos,
            TotalItems = totalCount,
            TotalPages = request.PageSize.HasValue && request.PageSize.Value > 0
                ? (int)Math.Ceiling(totalCount / (double)request.PageSize.Value)
                : 1, 
            CurrentPage = request.PageNumber ?? 1
        };
        return ServiceResult<PagedResult<TaskDTO>>.Ok(pagedResult);
    }

    public async Task<ServiceResult<int>> CountTasksByAssignedUserAsync(int assignedUserId, TasksStatus? status = null, TasksPriority? priority = null)
    {
        // Przykład: 
        // a) Pobrać bazowe IQueryable
        // b) Filtrować w serwisie
        var query = _taskRepository.GetAllQueryable()
            .Where(t => t.AssignedUserId == assignedUserId);

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }
        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        var count = await query.CountAsync();

        return ServiceResult<int>.Ok(count);
    }

    // --- Tworzenie, edycja, usuwanie ---

    public async Task<ServiceResult<TaskDTO>> CreateTaskAsync(int teamId, int sectionId, TaskCreateRequest createRequest)
    {
        if (createRequest.AssignedUserId == null)
            return ServiceResult<TaskDTO>.Fail("AssignedUserId is required.");

        int assignedUserId = createRequest.AssignedUserId.Value;

        if (!Enum.IsDefined(typeof(TasksPriority), createRequest.Priority))
        {
            return ServiceResult<TaskDTO>.Fail("Invalid priority specified.");
        }

        // Sprawdź czy sekcja istnieje
        var section = await _sectionService.GetSectionById(sectionId);
        if (!section.Success || section.Data == null)
        {
            return ServiceResult<TaskDTO>.Fail("Section not found.");
        }

        if(section.Data.TeamId != teamId)
        {
            return ServiceResult<TaskDTO>.Fail("Section is not in the team.");
        }

        // Sprawdź czy sekcja nalezy do Teamu

        // Sprawdź czy user istnieje
        var user = await _userService.GetUserById(assignedUserId);
        if (!user.Success || user.Data == null)
        {
            return ServiceResult<TaskDTO>.Fail("User not found.");
        }
        // Sprawdź czy przydzielony user należy do zespołu
        var userTeam = await _userTeamService.IsUserInTeam(section.Data.TeamId, assignedUserId);
        if (!userTeam.Success || !userTeam.Data)
        {
            return ServiceResult<TaskDTO>.Fail("User is not in the team.");
        }

        if(createRequest.DueDate != null)
            if (createRequest.DueDate < DateTime.UtcNow)
                return ServiceResult<TaskDTO>.Fail("Due date must be in the future.");


        // Tworzymy nową encję:
        var taskEntity = new Tasks
        {
            SectionId = sectionId,
            AssignedUserId = assignedUserId,
            Title = createRequest.Title,
            Description = createRequest.Description,
            Priority = createRequest.Priority,
            DueDate = createRequest.DueDate ?? null,
            CreatedAt = DateTime.UtcNow
        };

        // Dodajemy do kontekstu
        _taskRepository.AddTask(taskEntity);
        await _taskRepository.SaveChangesAsync();

        // Zwracamy DTO
        return ServiceResult<TaskDTO>.Ok(MapToDto(taskEntity));
    }

    public async Task<ServiceResult<TaskDTO>> UpdateTaskAsync(int taskId, int userId, TaskUpdateRequest updateRequest)
    {

        // Znajdź istniejący task
        var existingTask = await _taskRepository.GetByIdAsync(
            taskId,
            includeSection: true,
            includeAssignedUser: false,
            includeTeam: false
        );
        if (updateRequest.Priority.HasValue && !Enum.IsDefined(typeof(TasksPriority), updateRequest.Priority.Value))
        {
            return ServiceResult<TaskDTO>.Fail("Invalid priority specified.");
        }

        if (updateRequest.Status.HasValue && !Enum.IsDefined(typeof(TasksStatus), updateRequest.Status.Value))
        {
            return ServiceResult<TaskDTO>.Fail("Invalid status specified.");
        }

        if (existingTask == null)
        {
            return ServiceResult<TaskDTO>.Fail("Task not found"); 
        }

        // Sprawdź czy użytkownik może edytować taska
        if (!await _serviceHelper.CanPerformAction(userId, existingTask.Section.TeamId, existingTask.AssignedUserId, UserTeamRole.Manager))
        {
            return ServiceResult<TaskDTO>.Fail("You don't have permission to edit this task");
        }

        if (updateRequest.SectionId != null)
        {
            // Sprawdź czy sekcja istnieje
            var section = await _sectionService.GetSectionById(updateRequest.SectionId.Value);
            if (!section.Success || section.Data == null)
            {
                return ServiceResult<TaskDTO>.Fail("Section not found");
            }
            // Sprawdź czy sekcja należy do zespołu
            if (section.Data.TeamId != existingTask.Section.TeamId)
            {
                return ServiceResult<TaskDTO>.Fail("Section is not in the team");
            }
            existingTask.SectionId = updateRequest.SectionId.Value;
        }
        if (updateRequest.AssignedUserId != null)
        {
            // Sprawdź czy użytkownik istnieje
            var user = await _userService.GetUserById(updateRequest.AssignedUserId.Value);
            if (user == null)
            {
                return ServiceResult<TaskDTO>.Fail("User not found");
            }
            // Sprawdź czy użytkownik należy do zespołu
            var userTeam = await _userTeamService.IsUserInTeam(existingTask.Section.TeamId, updateRequest.AssignedUserId.Value);
            if (!userTeam.Success || !userTeam.Data)
            {
                return ServiceResult<TaskDTO>.Fail("User is not in the team");
            }
            existingTask.AssignedUserId = updateRequest.AssignedUserId.Value;
        }
        if (updateRequest.Title != null)
        {
            existingTask.Title = updateRequest.Title;
        }
        if (updateRequest.Description != null)
        {
            existingTask.Description = updateRequest.Description;
        }
        if (updateRequest.Status != null)
        {
            existingTask.Status = updateRequest.Status.Value;
        }
        if (updateRequest.Priority != null)
        {
            existingTask.Priority = updateRequest.Priority.Value;
        }
        if (updateRequest.DueDate != null)
        {
            // Sprawdź czy data jest w przyszłości
            if (updateRequest.DueDate.Value.Date < DateTime.UtcNow.Date)
            {
                return ServiceResult<TaskDTO>.Fail("Due date must be today or in the future");
            }
            existingTask.DueDate = updateRequest.DueDate.Value;
        }

        _taskRepository.UpdateTask(existingTask);
        await _taskRepository.SaveChangesAsync();

        return ServiceResult<TaskDTO>.Ok(MapToDto(existingTask));
    }

    public async Task<ServiceResult<bool>> DeleteTaskAsync(int taskId, int userId)
    {

        var existingTask = await _taskRepository.GetByIdAsync(
            taskId,
            includeSection: false,
            includeAssignedUser: false,
            includeTeam: false
        );

        if (existingTask == null)
        {
            return ServiceResult<bool>.Fail("Task Not Found");
        }

        // Sprawdź czy użytkownik może usunąć taska
        if(!await _serviceHelper.CanPerformAction(userId, taskId, existingTask.AssignedUserId, UserTeamRole.Manager))
        {
            return ServiceResult<bool>.Fail("You don't have permission to delete this task");
        }



        _taskRepository.DeleteTask(existingTask);
        await _taskRepository.SaveChangesAsync();

        return ServiceResult<bool>.Ok(true);
    }

    // --- Funkcje pomocnicze ---

    private IQueryable<Tasks> SortTasks(IQueryable<Tasks> query, TaskOrderBy? orderBy, bool ascending)
    {

        switch (orderBy)
        {
            case TaskOrderBy.CreatedAt:
                return ascending
                    ? query.OrderBy(t => t.CreatedAt)
                    : query.OrderByDescending(t => t.CreatedAt);
            case TaskOrderBy.DueDate:
                return ascending
                    ? query.OrderBy(t => t.DueDate)
                    : query.OrderByDescending(t => t.DueDate);
            case TaskOrderBy.Priority:
                return ascending
                    ? query.OrderBy(t => t.Priority)
                    : query.OrderByDescending(t => t.Priority);
            default:
                return ascending
                    ? query.OrderBy(t => t.CreatedAt)
                    : query.OrderByDescending(t => t.CreatedAt);
        }
    }
    
    private TaskDTO MapToDto(Tasks entity)
    {
        return new TaskDTO
        {
            Id = entity.Id,
            Title = entity.Title,
            Description = entity.Description,
            Status = entity.Status,
            Priority = entity.Priority,
            CreatedAt = entity.CreatedAt,
            DueDate = entity.DueDate,
            SectionId = entity.SectionId,
            AssignedUserId = entity.AssignedUserId,

            // Jeśli entity.Section != null, to pobierz name:
            SectionName = entity.Section?.Title,
            TeamId = entity.Section?.TeamId,
            TeamName = entity.Section?.Team?.Name,
            AssignedUserName = entity.AssignedUser?.Username

        };
    }

    private DateTime? AdjustToUtc(DateTime? localDate, int? offsetInMinutes)
    {
        if (localDate == null || offsetInMinutes == null)
            return localDate;

        return localDate.Value.AddMinutes(-offsetInMinutes.Value);
    }

}
