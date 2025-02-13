using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Core.Entities
{
    public class Teams
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Name { get; set; }
        public string ?Description { get; set; }
        public int OwnerId { get; set; }
        public Users Owner { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ICollection<UsersTeams> UsersTeams { get; set; }
    }
}
