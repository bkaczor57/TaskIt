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
        [Required, MaxLength(30)]
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ICollection<Tasks> Tasks { get; set; }

    }
}
