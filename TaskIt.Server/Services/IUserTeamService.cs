using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;

namespace TaskIt.Server.Services
{
    public interface IUserTeamService
    {
        //Add User to Team
        //Delete User From Team
        // Get Users in Team

        ServiceResult<bool> IsUserInTeam(int teamId, int userId);
        Task<ServiceResult<List<UserDTO?>>> GetUsersByTeamId(int teamId);
        Task<ServiceResult<List<TeamDTO?>>> GetTeamsByUserId(int userId);


    }
}
