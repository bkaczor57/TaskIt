using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TeamInviteRequest
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int InvitedUserId { get; set; }
        public int InvitingUserId { get; set; }
        public UserTeamRole? TeamRole { get; set; } 

    }
}
