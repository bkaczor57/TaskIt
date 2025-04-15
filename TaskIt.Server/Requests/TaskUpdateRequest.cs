using System.ComponentModel.DataAnnotations;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TaskUpdateRequest
    {
        public int? AssignedUserId { get; set; }
        public int? SectionId { get; set; }
        [MaxLength(30)]
        public string? Title { get; set; }
        [MaxLength(300)]
        public string? Description { get; set; }
        public TasksStatus? Status { get; set; }
        public TasksPriority? Priority { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
