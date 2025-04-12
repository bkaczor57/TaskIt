using Microsoft.EntityFrameworkCore;
using Microsoft.Win32.SafeHandles;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.Data;

namespace TaskIt.Server.Repository
{
    public class TasksRepository
    {
        private readonly AppDbContext _context;
        public TasksRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Tasks>> GetTasks()
        {
            return await _context.Tasks
                .Include(t => t.Section)
                .ThenInclude(s => s.Team)
                .Include(t => t.AssignedUser)
                .ToListAsync();
        }

        public async Task<List<Tasks>> GetTasksFilteredAsync(
                                                            int? assignedUserId = null,
                                                            int? sectionId = null,
                                                            TasksStatus? status = null,
                                                            TasksPriority? priority = null,
                                                            DateTime? dueBefore = null,
                                                            DateTime? dueAfter = null
            )
        {
            var query = _context.Tasks
                .Include(t => t.Section)
                .ThenInclude(s => s.Team)
                .Include(t => t.AssignedUser)
                .AsQueryable();

            if (assignedUserId.HasValue)
            {
                query = query.Where(t => t.AssignedUserId == assignedUserId.Value);
            }

            if (sectionId.HasValue)
            {
                query = query.Where(t => t.SectionId == sectionId.Value);
            }

            if (status.HasValue)
            {
                query = query.Where(t => t.Status == status.Value);
            }

            if (priority.HasValue)
            {
                query = query.Where(t => t.Priority == priority.Value);
            }

            if (dueBefore.HasValue)
            {
                query = query.Where(t => t.DueDate <= dueBefore.Value);
            }

            if (dueAfter.HasValue)
            {
                query = query.Where(t => t.DueDate >= dueAfter.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Tasks?> GetTaskById(int taskId)
        {
            return await _context.Tasks
                .Include(t => t.Section)
                .ThenInclude(s => s.Team)
                .Include(t => t.AssignedUser)
                .FirstOrDefaultAsync(t => t.Id == taskId);
        }

        public async Task<List<Tasks>> GetTasksByAssignedUser(int assignedUserId)
        {
            return await _context.Tasks
                .Include(t => t.Section)
                .ThenInclude(s => s.Team)
                .Include(t => t.AssignedUser)
                .Where(t => t.AssignedUserId == assignedUserId)
                .ToListAsync();
        }

        public async Task<int> CountTasksByAssignedUser(int assignedUserId, string? status = null, string? priority = null)
        {
            var query = _context.Tasks
                .Where(t => t.AssignedUserId == assignedUserId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<TasksStatus>(status, true, out var parsedStatus))
            {
                query = query.Where(t => t.Status == parsedStatus);
            }

            if (!string.IsNullOrEmpty(priority) && Enum.TryParse<TasksPriority>(priority, true, out var parsedPriority))
            {
                query = query.Where(t => t.Priority == parsedPriority);
            }

            return await query.CountAsync();
        }

        public async Task<(List<Tasks> Tasks, int TotalCount)> GetTasksByAssignedUserPaged(
            int assignedUserId,
            int pageNumber,
            int pageSize,
            string? status,
            string? priority,
            List<int>? teamIds, 
            string? orderBy = null,
            bool ascending = true)
        {
            var query = _context.Tasks
                .Include(t => t.Section)
                .ThenInclude(s => s.Team)
                .Include(t => t.AssignedUser)
                .Where(t => t.AssignedUserId == assignedUserId)
                .AsQueryable();


            // filtrowanie po Status
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<TasksStatus>(status, true, out var parsedStatus))
            {
                query = query.Where(t => t.Status == parsedStatus);
            }

            // filtrowanie po Priority
            if (!string.IsNullOrEmpty(priority) && Enum.TryParse<TasksPriority>(priority, true, out var parsedPriority))
            {
                query = query.Where(t => t.Priority == parsedPriority);
            }

            if (teamIds != null && teamIds.Any())
            {
                query = query.Where(t => teamIds.Contains(t.Section.TeamId));
            }


            // sortowanie 
            if (!string.IsNullOrEmpty(orderBy))
            {
                switch (orderBy.ToLower())
                {
                    case "createdat":
                        query = ascending
                            ? query.OrderBy(t => t.CreatedAt)
                            : query.OrderByDescending(t => t.CreatedAt);
                        break;

                    case "duedate":
                        query = ascending
                            ? query.OrderBy(t => t.DueDate)
                            : query.OrderByDescending(t => t.DueDate);
                        break;

                    case "priority":
                        query = ascending
                            ? query.OrderBy(t => t.Priority)
                            : query.OrderByDescending(t => t.Priority);
                        break;

                    default:
                        // fallback: jak nie rozpoznano orderBy
                        query = ascending
                            ? query.OrderBy(t => t.CreatedAt)
                            : query.OrderByDescending(t => t.CreatedAt);
                        break;
                }
            }
            else
            {
                // domyślne sortowanie, jeśli orderBy nie podano
                query = ascending
                    ? query.OrderBy(t => t.CreatedAt)
                    : query.OrderByDescending(t => t.CreatedAt);
            }




            var totalCount = await query.CountAsync();

            var tasks = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (tasks, totalCount);
        }

        public void AddTask (Tasks task)
        {
             _context.Tasks.Add(task);
        }

        public void UpdateTask(Tasks task)
        {
            _context.Tasks.Update(task);

        }

        public void DeleteTask(Tasks task)
        {

            _context.Tasks.Remove(task);

        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }


    }
}
