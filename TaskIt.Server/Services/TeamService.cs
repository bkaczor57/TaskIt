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
        private readonly IUserTeamRepository _userTeamRepository;

        public TeamService(ITeamRepository teamRepository, IUserTeamRepository userTeamRepository, IUserRepository userRepository)
        {
            _teamRepository = teamRepository;
            _userTeamRepository = userTeamRepository;
        }
        public async Task<ServiceResult<TeamDTO>> CreateTeam(int ownerId, TeamCreateRequest request)
        {
            var team = TeamMapper.ToTeamsEntity(request);

            team.OwnerId = ownerId;
            _teamRepository.AddTeam(team);
            await _teamRepository.SaveChangesAsync();

            var userTeam = new UsersTeams
            {
                TeamId = team.Id,
                UserId = ownerId,
                Role = Core.Enums.UserTeamRole.Admin
            };

            _userTeamRepository.AddUserToTeam(userTeam);
            await _userTeamRepository.SaveChangesAsync();

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
        public async Task<ServiceResult<List<TeamDTO>>> GetTeamsByOwnerId(int ownerId)
        {
            var teams = await _teamRepository.GetTeamsByOwnerId(ownerId);
            if (teams.Count == 0 || teams == null)
            {
                return ServiceResult<List<TeamDTO>>.Fail("Teams not Found");
            }
            return ServiceResult<List<TeamDTO>>.Ok(teams.Select(TeamMapper.ToTeamDTO).ToList());

        }
        public async Task<ServiceResult<List<TeamDTO>>> GetUserTeams(int userId)
        {
            var teams = await _userTeamRepository.GetTeamsByUserId(userId);
            if (teams.Count == 0 || teams == null)
            {
                return ServiceResult<List<TeamDTO>>.Fail("Teams not Found");
            }
            return ServiceResult<List<TeamDTO>>.Ok(teams.Select(TeamMapper.ToTeamDTO).ToList());

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
            var user = await _teamRepository.GetTeamById(teamId);
            if (user == null)
            {
                return ServiceResult<TeamDTO>.Fail("Team not Found");
            }
            if (request.Name != null)
            {
                user.Name = request.Name;
            }
            if (request.Description != null)
            {
                user.Description = request.Description;
            }
            _teamRepository.UpdateTeam(user);
            await _teamRepository.SaveChangesAsync();
            return ServiceResult<TeamDTO>.Ok(TeamMapper.ToTeamDTO(user));
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
