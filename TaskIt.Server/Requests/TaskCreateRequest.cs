using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TaskCreateRequest
    {
        public int AssignedUserId { get; set; }
        public TasksStatus TaskStatus { get; set; }
        public TasksPriority TaskPriority { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }

    }
}
