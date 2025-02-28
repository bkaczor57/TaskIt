using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface IUserTeamService
    {
        //Add User to Team
        Task<ServiceResult<UserTeamDTO>> AddUserToTeam(UserTeamAddRequest userTeamRequest);
        //Delete User From Team
        Task<ServiceResult<bool>> DeleteUserFromTeam(UserTeamDeleteRequest userTeamRequest);
        // Update User Role in Team
        Task<ServiceResult<UserTeamDTO>> UpdateUserRoleInTeam(UserTeamUpdateRequest userTeamRequest);

        // Get Users in Team
        Task<ServiceResult<bool>> IsUserInTeam(int teamId, int userId);
        Task<ServiceResult<UserTeamRole?>> GetUserRole(int teamId, int userId);
        Task<ServiceResult<List<UserDTO?>>> GetUsersByTeamId(int teamId);
        Task<ServiceResult<List<TeamDTO?>>> GetTeamsByUserId(int userId);

       


    }
}
