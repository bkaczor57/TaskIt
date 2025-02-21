using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Core.Entities
{
    public class Users
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(20)]
        public required string Username { get; set; }
        [Required]
        public required string PasswordHash { get; set; }
        [Required, MinLength(8), MaxLength(100)]
        public required string Email { get; set; }

        [Required, MinLength(2), MaxLength(30)]
        public required string FirstName{ get; set; }
        [Required, MinLength(2), MaxLength(30)]
        public required string LastName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            
        public ICollection<UsersTeams>? UsersTeams { get; set; }
        public ICollection<Teams>? OwnedTeams { get; set; }
        public ICollection<TeamInvites>? UserInvitationsSent { get; set; }
        public ICollection<TeamInvites>? UserInvitationsReceived { get; set; }
        public ICollection<Tasks>? Tasks { get; set; }
        public ICollection<Comments>? Comments { get; set; }
        public ICollection<Notifications>? Notifications { get; set; }
    }
}
