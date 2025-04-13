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

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<TaskDTO?> GetTaskByIdAsync(int taskId, bool includeTeam)
    {
        // todo: ServiceResult, zwracanie błędów i komunikatów
        // pobieranie taska z repozytorium, opcjonalnie z wczytaniem zespołu
        var taskEntity = await _taskRepository.GetByIdAsync(
            taskId,
            includeSection: true,
            includeAssignedUser: true,
        includeTeam: includeTeam
        );

        if (taskEntity == null) return null;

        // Mapowanie DTO
        return MapToDto(taskEntity);
    }

    public async Task<(List<TaskDTO> Tasks, int TotalCount)> GetTasksFilteredAsync(TasksQueryRequest request)
    {
        // Todo: ServiceResult, zwracanie błędów i komunikatów
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
        if (request.DueBefore.HasValue)
        {
            query = query.Where(t => t.DueDate <= request.DueBefore.Value);
        }
        if (request.DueAfter.HasValue)
        {
            query = query.Where(t => t.DueDate >= request.DueAfter.Value);
        }
        if (request.CreatedBefore.HasValue)
        {
            query = query.Where(t => t.CreatedAt <= request.CreatedBefore.Value);
        }
        if (request.CreatedAfter.HasValue)
        {
            query = query.Where(t => t.CreatedAt >= request.CreatedAfter.Value);
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

        return (taskDtos, totalCount);
    }

    public async Task<(List<TaskDTO> Tasks, int TotalCount)> GetUserTasksWithSearchAsync(TasksUserQueryRequest request)
    {
        // W tym miejscu chcemy juz pobierać również teamy - user musi wiedzieć do jakiego zespołu należy dane zadanie
        var query = _taskRepository.GetAllQueryable()
            .Include(t => t.Section)
            .ThenInclude(s => s.Team)
            .Include(t => t.AssignedUser)
            .Where(t => t.AssignedUserId == request.AssignedUserId);

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
        return (dtos, totalCount);
    }

    public async Task<int> CountTasksByAssignedUserAsync(int assignedUserId, TasksStatus? status = null, TasksPriority? priority = null)
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

        return await query.CountAsync();
    }

    // --- Tworzenie, edycja, usuwanie ---

    public async Task<TaskDTO> CreateTaskAsync(CreateTaskRequest createRequest)
    {

        // todo:
        // ServiceResult, zwracanie błędów i komunikatów
        // Logika biznesowa: np. weryfikacja czy Section istnieje, user istnieje itd.
        // (Dostęp do innego repo lub serwisu)

        // Tworzymy nową encję:
        var taskEntity = new Tasks
        {
            SectionId = createRequest.SectionId,
            AssignedUserId = createRequest.AssignedUserId,
            Title = createRequest.Title,
            Description = createRequest.Description,
            Status = createRequest.Status,
            Priority = createRequest.Priority,
            DueDate = createRequest.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        // Dodajemy do kontekstu
        _taskRepository.AddTask(taskEntity);
        await _taskRepository.SaveChangesAsync();

        // Zwracamy DTO
        return MapToDto(taskEntity);
    }

    public async Task<TaskDTO?> UpdateTaskAsync(int taskId, UpdateTaskRequest updateRequest)
    {
        // todo: ServiceResult, zwracanie błędów i komunikatów 

        // Znajdź istniejący task
        var existingTask = await _taskRepository.GetByIdAsync(
            taskId,
            includeSection: false,
            includeAssignedUser: false,
            includeTeam: false
        );

        if (existingTask == null)
        {
            return null; 
        }
        
        if(updateRequest.SectionId != null)
        {
            existingTask.SectionId = updateRequest.SectionId.Value;
        }
        if (updateRequest.AssignedUserId != null)
        {
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
            existingTask.DueDate = updateRequest.DueDate.Value;
        }

        _taskRepository.UpdateTask(existingTask);
        await _taskRepository.SaveChangesAsync();

        return MapToDto(existingTask);
    }

    public async Task<bool> DeleteTaskAsync(int taskId)
    {
        // todo: ServiceResult, zwracanie błędów i komunikatów
        var existingTask = await _taskRepository.GetByIdAsync(
            taskId,
            includeSection: false,
            includeAssignedUser: false,
            includeTeam: false
        );

        if (existingTask == null)
        {
            return false;
        }

        _taskRepository.DeleteTask(existingTask);
        await _taskRepository.SaveChangesAsync();

        return true;
    }

    // --- Funkcje pomocnicze ---

    private IQueryable<Tasks> SortTasks(IQueryable<Tasks> query, string? orderBy, bool ascending)
    {
        if (string.IsNullOrEmpty(orderBy))
        {
            // Domyślne
            return ascending
                ? query.OrderBy(t => t.CreatedAt)
                : query.OrderByDescending(t => t.CreatedAt);
        }

        switch (orderBy.ToLower())
        {
            case "createdat":
                return ascending
                    ? query.OrderBy(t => t.CreatedAt)
                    : query.OrderByDescending(t => t.CreatedAt);
            case "duedate":
                return ascending
                    ? query.OrderBy(t => t.DueDate)
                    : query.OrderByDescending(t => t.DueDate);
            case "priority":
                return ascending
                    ? query.OrderBy(t => t.Priority)
                    : query.OrderByDescending(t => t.Priority);
            case "teamname":
                // UWAGA: musimy mieć włączone .Include(t => t.Section.Team) wcześniej,
                // w przeciwnym razie Team będzie null i EF nie posortuje.
                return ascending
                    ? query.OrderBy(t => t.Section.Team.Name)
                    : query.OrderByDescending(t => t.Section.Team.Name);
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

        };
    }
    
}
