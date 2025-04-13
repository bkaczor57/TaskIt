using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class CreateTaskRequest
    {
        public int SectionId { get; set; }
        public int AssignedUserId { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public TasksStatus Status { get; set; } = TasksStatus.Pending;
        public TasksPriority Priority { get; set; } = TasksPriority.Medium;
        public DateTime? DueDate { get; set; }
    }
}
