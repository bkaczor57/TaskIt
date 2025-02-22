using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class UserTeamAddUserToTeamRequest
    {
        public int UserId { get; set; }
        public UserTeamRole? Role { get; set; } // Opcjonalnie, domyślnie Member
    }
}
