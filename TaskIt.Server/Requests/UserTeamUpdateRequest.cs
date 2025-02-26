using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class UserTeamUpdateRequest
    {
        public int UserId { get; set; }
        public int TeamId { get; set; }
        public UserTeamRole? Role { get; set; } // Opcjonalnie, domyślnie Member
    }
}
