using System.Reflection.Metadata.Ecma335;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
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


        public async Task<ServiceResult<bool>> IsUserInTeam(int teamId, int userId)
        {

            var result =  await _userTeamRepository.GetUserTeam(teamId, userId);
            if (result == null)
                return ServiceResult<bool>.Fail("User is not in team");

            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> IsUserInRoleOrHigher(int teamId, int userId, UserTeamRole requiredRole)
        {
            var userRole = await _userTeamRepository.GetUserRole(teamId, userId);
            if (userRole == null)
                return ServiceResult<bool>.Fail("User is not in team");
            if ((int)userRole<(int)requiredRole)
                return ServiceResult<bool>.Fail($"Insufficient permissions. Required: {requiredRole}, but user has: {userRole}.");

            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<UserTeamRole?>> GetUserRole(int teamId, int userId)
        {
            var userRole = await _userTeamRepository.GetUserRole(teamId, userId);
            if (userRole == null)
                return ServiceResult<UserTeamRole?>.Fail("User is not in team");
            return ServiceResult<UserTeamRole?>.Ok(userRole);
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
            var existingUser = await _userTeamRepository.GetUserTeam(userTeamRequest.TeamId, userTeamRequest.UserId);
            if (existingUser!=null)
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


        public async Task<ServiceResult<bool>>DeleteUserFromTeam(int teamId, int userId)
        {

            var userTeam = await _userTeamRepository.GetUserTeam(teamId, userId);
            if (userTeam == null)
            {
                return ServiceResult<bool>.Fail("User is not in team");
            }

            _userTeamRepository.DeleteUserFromTeam(userTeam);
            await _userTeamRepository.SaveChangesAsync();

            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<UserTeamDTO>> UpdateUserRoleInTeam(int teamId, int userId, UserTeamUpdateRequest userTeamRequest)
        {
            var userTeam = await _userTeamRepository.GetUserTeam(teamId, userId);
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
