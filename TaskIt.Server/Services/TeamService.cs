using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;
using TaskIt.Server.Mappings;
using TaskIt.Server.Repository;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public class TeamService : ITeamService
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IUserTeamService _userTeamService;

        public TeamService(ITeamRepository teamRepository, IUserTeamService userTeamService)
        {
            _teamRepository = teamRepository;
            _userTeamService = userTeamService;
        }
        public async Task<ServiceResult<TeamDTO>> CreateTeam(int ownerId, TeamCreateRequest request)
        {
            var team = TeamMapper.ToTeamsEntity(request);

            team.OwnerId = ownerId;
            _teamRepository.AddTeam(team);
            await _teamRepository.SaveChangesAsync();

            var userTeamRequest = new UserTeamAddRequest
            {
                TeamId = team.Id,
                UserId = ownerId,
                Role = Core.Enums.UserTeamRole.Admin
            };

            await _userTeamService.AddUserToTeam(userTeamRequest);


            var userDTO = TeamMapper.ToTeamDTO(team);

            return ServiceResult<TeamDTO>.Ok(userDTO);
        }

        public async Task<ServiceResult<TeamDTO>> GetTeamById(int teamId)
        {
            var team = await _teamRepository.GetTeamById(teamId);
            if (team == null)
            {
                return ServiceResult<TeamDTO>.Fail("Team not Found");
            }

            return ServiceResult<TeamDTO>.Ok(TeamMapper.ToTeamDTO(team));

        }


        public async Task<ServiceResult<bool>> DeleteTeam(int teamId)
        {
            var team = await _teamRepository.GetTeamById(teamId);
            if (team == null)
            {
                return ServiceResult<bool>.Fail("Team not Found");
            }
            _teamRepository.DeleteTeam(team);
            await _teamRepository.SaveChangesAsync();

            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<TeamDTO>> UpdateTeam(int teamId, TeamUpdateRequest request)
        {
            var team = await _teamRepository.GetTeamById(teamId);
            if (team == null)
            {
                return ServiceResult<TeamDTO>.Fail("Team not Found");
            }


            if (request.Name != null)
            {
                team.Name = request.Name;
            }
            if (request.Description != null)
            {
                team.Description = request.Description;
            }
            _teamRepository.UpdateTeam(team);
            await _teamRepository.SaveChangesAsync();
            return ServiceResult<TeamDTO>.Ok(TeamMapper.ToTeamDTO(team));
        }

        public async Task<ServiceResult<bool>> IsUserOwner(int userId, int teamId)
        {
            var team = await _teamRepository.GetTeamById(teamId);
            if (team == null)
            {
                return ServiceResult<bool>.Fail("Team not Found");
            }
            bool result = team.OwnerId == userId;
            if (!result)
            {
                return ServiceResult<bool>.Fail("User is not an Owner");
            }
            return ServiceResult<bool>.Ok(result);

        }
    }
}
