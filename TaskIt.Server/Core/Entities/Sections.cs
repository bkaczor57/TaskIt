using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Core.Entities
{
    public class Sections
    {
        [Key]
        public int Id { get; set; }
        //Foreign Key
        public int TeamId { get; set; }
        public Teams? Team { get; set; }
        [Required, MaxLength(20)]
        public required string Title { get; set; }
        public int Position { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Tasks>? Tasks { get; set; }

    }
}
