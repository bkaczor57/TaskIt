using System.ComponentModel.DataAnnotations;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Core.Entities
{
    public class Tasks
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int SectionId { get; set; }
        public Sections? Section { get; set; }
        public int AssignedUserId{ get; set; }
        public Users? AssignedUser { get; set; }
        public TasksStatus Status { get; set; } = TasksStatus.Open;
        public TasksPriority Priority { get; set; } = TasksPriority.Medium;
        [Required, MaxLength(30)]
        public string? Title { get; set; } = "New Task";
        [Required,MaxLength(300)]
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }

        public ICollection<Comments>? Comments { get; set; }

        public ICollection<Notifications>?  Notifications { get; set; }

    }
}
