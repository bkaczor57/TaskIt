using System.ComponentModel.DataAnnotations;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Core.Entities
{
    public class TeamInvites
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TeamId { get; set; }
        [Required]
        // Foreign Key
        public int InvitedUserId { get; set; }
        public Users? InvitedUser { get; set; }
        // Foreign Key
        public int InvitingUserId { get; set; }
        public Users? InvitingUser { get; set; }

        public InviteStatus Status { get; set; } = InviteStatus.Pending;
        public DateTime InviteDate { get; set; } = DateTime.Now;
        public DateTime? ResponseDate { get; set; }


    }
}
