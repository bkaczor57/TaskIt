using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;

namespace TaskIt.Server.Mappings
{
    public class UserTeamMapper
    {
        public static UserTeamDTO ToUserTeamDTO(UsersTeams userTeam)
        {
            return new UserTeamDTO
            {
                UserId = userTeam.UserId,
                TeamId = userTeam.TeamId,
                Role = userTeam.Role
            };
        }
    }
}
