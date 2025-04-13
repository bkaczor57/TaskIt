using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface ITaskService
    {
        Task<TaskDTO?> GetTaskByIdAsync(int taskId, bool includeTeam);
        Task<(List<TaskDTO> Tasks, int TotalCount)> GetTasksFilteredAsync(TasksQueryRequest request);
        Task<(List<TaskDTO> Tasks, int TotalCount)> GetUserTasksWithSearchAsync(TasksUserQueryRequest request);
        Task<int> CountTasksByAssignedUserAsync(int assignedUserId, TasksStatus? status = null, TasksPriority? priority = null);
        Task<TaskDTO> CreateTaskAsync(CreateTaskRequest request);
        Task<TaskDTO> UpdateTaskAsync(int taskId, UpdateTaskRequest request);
        Task<bool> DeleteTaskAsync(int taskId);

    }
}