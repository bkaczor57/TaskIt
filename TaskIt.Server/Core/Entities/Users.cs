using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Core.Entities
{
    public class Users
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(20)]
        public string Username { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        [Required, MaxLength(100)]
        public string Email { get; set; }
        public string FirstName{ get; set; }
        public string LastName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
            
        public ICollection<UsersTeams> UsersTeams { get; set; }
        public ICollection<Teams> OwnedTeams { get; set; }
        public ICollection<TeamInvites> UserInvitationsSent { get; set; }
        public ICollection<TeamInvites> UserInvitationsReceived { get; set; }
        public ICollection<Tasks> Tasks { get; set; }
        public ICollection<Comments> Comments { get; set; }

        public ICollection<Notifications> Notifications { get; set; }
    }
}
