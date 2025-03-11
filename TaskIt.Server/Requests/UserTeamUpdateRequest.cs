using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class UserTeamUpdateRequest
    {
        public UserTeamRole? Role { get; set; } // Opcjonalnie, domyślnie Member
    }
}
