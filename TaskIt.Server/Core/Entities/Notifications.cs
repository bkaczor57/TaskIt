using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Core.Entities
{
    public class Notifications
    {
        [Key]
        public int Id { get; set; }
        // Foreign Key

        [Required]
        public int UserId { get; set; }
        public Users? User { get; set; }
        [Required]
        public NotificationType Type { get; set; } = NotificationType.General;
        public string? Message { get; set; }

        // Foreign Keys:
        public int? TaskId { get; set; }
        public Tasks? Task { get; set; }

        public int? CommentId { get; set; }
        public Comments? Comment { get; set; }

        public int? TeamId { get; set; }
        public Teams? Team { get; set; }


        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
