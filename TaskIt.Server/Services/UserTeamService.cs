using System.Reflection.Metadata.Ecma335;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;
using TaskIt.Server.Mappings;
using TaskIt.Server.Repository;
using TaskIt.Server.Requests;

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
            
            if (users == null || users.Count == 0)
                return ServiceResult<List<UserDTO?>>.Fail("No users in team");

            var usersDTOs = users.Select(UserMapper.ToUserDTO).ToList();
            return ServiceResult<List<UserDTO?>>.Ok(usersDTOs);
        }

        public async Task<ServiceResult<List<TeamDTO?>>> GetTeamsByUserId(int userId)
        {
            var teams = await _userTeamRepository.GetTeamsByUserId(userId);
            if (teams == null || teams.Count==0)
                return ServiceResult<List<TeamDTO?>>.Fail("No teams for user");
            
            var teamsDTOs = teams.Select(TeamMapper.ToTeamDTO).ToList();

            return ServiceResult<List<TeamDTO?>>.Ok(teamsDTOs);
         }


        public async Task<ServiceResult<UserTeamDTO>> AddUserToTeam(UserTeamAddRequest userTeamRequest)
        {
            // Check if user is already in the team
            var existingUser =  _userTeamRepository.IsUserInTeam(userTeamRequest.UserId, userTeamRequest.TeamId);
            if (!existingUser)
            {
                return ServiceResult<UserTeamDTO>.Fail("User is already in this team.");
            }

            var userTeam = new UsersTeams
            {
                TeamId = userTeamRequest.TeamId,
                UserId = userTeamRequest.UserId,
                Role = userTeamRequest.Role ?? Core.Enums.UserTeamRole.Member
            };

            _userTeamRepository.AddUserToTeam(userTeam);
            await _userTeamRepository.SaveChangesAsync();

            var userTeamDTO = UserTeamMapper.ToUserTeamDTO(userTeam);

            return ServiceResult<UserTeamDTO>.Ok(userTeamDTO);
        }


        public async Task<ServiceResult<bool>>DeleteUserFromTeam(UserTeamDeleteRequest userTeamRequest)
        {

            var userTeam = await _userTeamRepository.GetUsersInTeam(userTeamRequest.TeamId, userTeamRequest.UserId);
            if (userTeam == null)
            {
                return ServiceResult<bool>.Fail("User is not in team");
            }

            _userTeamRepository.DeleteUserFromTeam(userTeam);
            await _userTeamRepository.SaveChangesAsync();

            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<UserTeamDTO>> UpdateUserRoleInTeam(UserTeamUpdateRequest userTeamRequest)
        {
            var userTeam = await _userTeamRepository.GetUsersInTeam(userTeamRequest.TeamId, userTeamRequest.UserId);
            if (userTeam == null)
            {
                return ServiceResult<UserTeamDTO>.Fail("User is not in team");
            }

            userTeam.Role = userTeamRequest.Role ?? userTeam.Role;

            _userTeamRepository.UpdateUserRoleInTeam(userTeam);
            await _userTeamRepository.SaveChangesAsync();

            var userTeamDTO = UserTeamMapper.ToUserTeamDTO(userTeam);

            return ServiceResult<UserTeamDTO>.Ok(userTeamDTO);
        }




    }
}
