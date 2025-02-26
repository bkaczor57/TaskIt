using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;
using TaskIt.Server.Mappings;
using TaskIt.Server.Repository;

namespace TaskIt.Server.Services
{
    public class UserTeamService : IUserTeamService
    {
        private readonly IUserTeamRepository _userTeamRepository;

        public UserTeamService(IUserTeamRepository userTeamRepository)
        {
            _userTeamRepository = userTeamRepository;
        }


        public ServiceResult<bool> IsUserInTeam(int teamId, int userId)
        {

            bool result =  _userTeamRepository.IsUserInTeam(teamId, userId);
            if (!result)
                return ServiceResult<bool>.Fail("User is not in team");

            return ServiceResult<bool>.Ok(result);
        }

        public async Task<ServiceResult<List<UserDTO?>>> GetUsersByTeamId(int teamId)
        {
            var users = await _userTeamRepository.GetUsersByTeamId(teamId);
            
            if (users == null)
                return ServiceResult<List<UserDTO?>>.Fail("No users in team");

            var usersDTOs = users.Select(UserMapper.ToUserDTO).ToList();
            return ServiceResult<List<UserDTO?>>.Ok(usersDTOs);
        }

        public async Task<ServiceResult<List<TeamDTO?>>> GetTeamsByUserId(int userId)
        {
            var teams = await _userTeamRepository.GetTeamsByUserId(userId);
            if (teams == null)
                return ServiceResult<List<TeamDTO?>>.Fail("No teams for user");
            // mapper dodac tutaj
            return null;
         }
           
    }
}
