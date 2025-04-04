using System.ComponentModel.DataAnnotations;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Core.Entities
{
    public class TeamInvites
    {
        [Key]
        public int Id { get; set; }
        //Foreign Key
        [Required]
        public int TeamId { get; set; }
        public Teams? Team { get; set; } 
        [Required]
        // Foreign Key
        public int InvitedUserId { get; set; }
        public Users? InvitedUser { get; set; }
        // Foreign Key
        public int InvitingUserId { get; set; }
        public Users? InvitingUser { get; set; }

        public UserTeamRole TeamRole{ get; set; } = UserTeamRole.Member;
        public InviteStatus Status { get; set; } = InviteStatus.Pending;
        public DateTime InviteDate { get; set; } = DateTime.UtcNow;
        public DateTime? ResponseDate { get; set;}

    }
}
