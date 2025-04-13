using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class UpdateTaskRequest
    {
        public int? AssignedUserId { get; set; }
        public int? SectionId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public TasksStatus? Status { get; set; }
        public TasksPriority? Priority { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
