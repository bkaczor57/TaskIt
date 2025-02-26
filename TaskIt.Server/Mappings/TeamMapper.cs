using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Mappings
{
    public class TeamMapper
    {
        public static Teams ToTeamsEntity(TeamCreateRequest request)
        {
            return new Teams
            {
                Name = request.Name,
                Description = request.Description
            };
        }

        public static TeamDTO ToTeamDTO(Teams team)
        {
            return new TeamDTO
            {
                Id = team.Id,
                Name = team.Name,
                Description = team.Description,
                OwnerId = team.OwnerId,
                CreatedAt = team.CreatedAt
            };
        }

    }
}
