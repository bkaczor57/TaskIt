using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Core.Entities
{
    public class Comments
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TaskId { get; set; }
        public Tasks? Task { get; set; }

        [Required]
        public int UserId { get; set; }
        public Users? User { get; set; }

        [Required, MaxLength(300)]
        public required string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Notifications>? Notifications { get; set; }


    }
}
