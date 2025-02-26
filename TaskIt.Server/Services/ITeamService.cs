using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface ITeamService
    {


        Task<ServiceResult<TeamDTO>> CreateTeam(int ownerId, TeamCreateRequest request);
        Task<ServiceResult<TeamDTO>> GetTeamById(int teamId);
        Task<ServiceResult<List<TeamDTO>>> GetTeamsByOwnerId(int ownerId);
        Task<ServiceResult<List<TeamDTO>>> GetUserTeams(int userId);

        Task<ServiceResult<TeamDTO>> UpdateTeam (int teamId, TeamUpdateRequest request);
        Task<ServiceResult<bool>> DeleteTeam(int teamId);

        Task<ServiceResult<bool>> IsUserOwner(int userId, int teamId);
    }
}
