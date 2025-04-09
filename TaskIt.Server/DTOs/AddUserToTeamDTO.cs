using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.DTOs
{
    public class AddUserToTeamDTO
    {
        public int UserId { get; set; }
        public int TeamId { get; set; } // 
        public UserTeamRole Role { get; set; } // ENUM
    }
}
