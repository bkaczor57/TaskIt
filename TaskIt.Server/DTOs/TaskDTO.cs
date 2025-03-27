using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.DTOs
{
    public class TaskDTO
    {
        public required int Id { get; set; }
        public required int SectionId { get; set; }
        public required int TeamId { get; set; }
        public required int AssignedUserId { get; set; }

        public TasksStatus TaskStatus { get; set; }
        public TasksPriority TaskPriority { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }

    }
}
