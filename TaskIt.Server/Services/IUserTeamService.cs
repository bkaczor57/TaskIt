using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface IUserTeamService
    {
        //Add User to Team
        Task<ServiceResult<AddUserToTeamDTO>> AddUserToTeam(UserTeamAddRequest userTeamRequest);
        //Delete User From Team
        Task<ServiceResult<bool>> DeleteUserFromTeam(int teamId, int userId);
        // Update User Role in Team
        Task<ServiceResult<TeamUserDTO>> UpdateUserRoleInTeam(int teamId, int userId, UserTeamUpdateRequest userTeamRequest);

        // Get Users in Team
        Task<ServiceResult<TeamUserDTO>> GetUserInTeam(int teamId, int userId);
        Task<ServiceResult<bool>> IsUserInTeam(int teamId, int userId);
        Task<ServiceResult<UserTeamRole?>> GetUserRole(int teamId, int userId);
        Task<ServiceResult<List<TeamUserDTO?>>> GetUsersByTeamId(int teamId);
        Task<ServiceResult<List<UserTeamDTO?>>> GetTeamsByUserId(int userId);

       


    }
}
