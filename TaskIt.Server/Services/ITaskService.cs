using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface ITaskService
    {
        Task<ServiceResult<TaskDTO>> GetTaskByIdAsync(int taskId, bool includeTeam);
        Task<ServiceResult<PagedResult<TaskDTO>>> GetTasksFilteredAsync(TasksQueryRequest request);
        Task<ServiceResult<PagedResult<TaskDTO>>> GetUserTasksWithSearchAsync(int userId, TasksUserQueryRequest request);
        Task<ServiceResult<int>> CountTasksByAssignedUserAsync(int assignedUserId, TaskCountRequest taskCountRequest);
        Task<ServiceResult<TaskDTO>> CreateTaskAsync(int teamId, int sectionId,TaskCreateRequest request);
        Task<ServiceResult<TaskDTO>> UpdateTaskAsync(int taskId, int userId, TaskUpdateRequest request);
        Task<ServiceResult<bool>> DeleteTaskAsync(int taskId, int userId);

    }
}