using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.DTOs
{


    public class TaskDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }

        public TasksStatus Status { get; set; }
        public TasksPriority Priority { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }

        // Przesyłanie SectionId, opcjonalnie SectionName
        public int SectionId { get; set; }
        public string? SectionName { get; set; }

        // Opcjonalne Przesyłanie TeamId i TeamName
        public int? TeamId { get; set; }
        public string? TeamName { get; set; }

        // Przesyłanie Assigned UserId oraz opcjonalnie AssignedUserName
        public int AssignedUserId { get; set; }
        public string? AssignedUserName { get; set; }
    }

}
