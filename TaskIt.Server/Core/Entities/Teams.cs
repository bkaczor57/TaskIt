using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Core.Entities
{
    public class Teams
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(20)]
        public required string Name { get; set; }

        [MaxLength(300)]
        public string ?Description { get; set; }
        public int OwnerId { get; set; }
        public Users? Owner { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<UsersTeams>? UsersTeams { get; set; }
        public ICollection<Sections>? Sections { get; set; }
        public ICollection<Notifications>? Notifications { get; set; }
    }
}
