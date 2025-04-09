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

        public async Task<ServiceResult<TeamUserDTO>> GetUserInTeam(int teamId, int userId)
        {
            var teamUser = await _userTeamRepository.GetUserTeam(teamId, userId);
            if (teamUser == null)
                return ServiceResult<TeamUserDTO>.Fail("Cannot Find User in Provided Team");

            var teamUserDTO = new TeamUserDTO
            {
                Id = teamUser.User.Id,
                Email = teamUser.User.Email,
                Username = teamUser.User.Username,
                FirstName = teamUser.User.FirstName,
                LastName = teamUser.User.LastName,
                Role = teamUser.Role.ToString()

            };
            return ServiceResult<TeamUserDTO>.Ok(teamUserDTO);
        }

        public async Task<ServiceResult<List<TeamUserDTO?>>> GetUsersByTeamId(int teamId)
        {
            var userTeams = await _userTeamRepository.GetUsersByTeamId(teamId);
            
            if (userTeams == null || userTeams.Count == 0)
                return ServiceResult<List<TeamUserDTO?>>.Fail("No users in team");

            var userTeamDTO = userTeams.Select(ut => new TeamUserDTO
            {
                Id = ut.User.Id,
                Email = ut.User.Email,
                Username = ut.User.Username,
                FirstName = ut.User.FirstName,
                LastName = ut.User.LastName,
                Role = ut.Role.ToString(),

            }).ToList();

            return ServiceResult<List<TeamUserDTO?>>.Ok(userTeamDTO);
        }

        public async Task<ServiceResult<List<UserTeamDTO?>>> GetTeamsByUserId(int userId)
        {
            var teams = await _userTeamRepository.GetTeamsByUserId(userId);
            if (teams == null || teams.Count==0)
                return ServiceResult<List<UserTeamDTO?>>.Fail("No teams for user");
            

            var userTeamDTOs = teams.Select(ut => new UserTeamDTO
            {
                Id = ut.Team.Id,
                Name = ut.Team.Name,
                Description= ut.Team.Description,
                CreatedAt = ut.Team.CreatedAt,
                OwnerId=ut.Team.OwnerId,
                Role = ut.Role.ToString()
            }).ToList();

            return ServiceResult<List<UserTeamDTO?>>.Ok(userTeamDTOs);
         }


        public async Task<ServiceResult<AddUserToTeamDTO>> AddUserToTeam(UserTeamAddRequest userTeamRequest)
        {
            // Check if user is already in the team
            var existingUser = await _userTeamRepository.GetUserTeam(userTeamRequest.TeamId, userTeamRequest.UserId);
            if (existingUser!=null)
            {
                return ServiceResult<AddUserToTeamDTO>.Fail("User is already in this team.");
            }

            var userTeam = new UsersTeams
            {
                TeamId = userTeamRequest.TeamId,
                UserId = userTeamRequest.UserId,
                Role = userTeamRequest.Role ?? Core.Enums.UserTeamRole.Member
            };

            _userTeamRepository.AddUserToTeam(userTeam);
            await _userTeamRepository.SaveChangesAsync();


            var addUserToTeamDTO = new AddUserToTeamDTO
            {
                UserId = userTeam.UserId,
                TeamId = userTeam.TeamId,
                Role = userTeam.Role
            };

            return ServiceResult<AddUserToTeamDTO>.Ok(addUserToTeamDTO);
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

        public async Task<ServiceResult<TeamUserDTO>> UpdateUserRoleInTeam(int teamId, int userId, UserTeamUpdateRequest userTeamRequest)
        {
            var userTeam = await _userTeamRepository.GetUserTeam(teamId, userId);
            if (userTeam == null)
            {
                return ServiceResult<TeamUserDTO>.Fail("User is not in team");
            }

            userTeam.Role = userTeamRequest.Role ?? userTeam.Role;

            _userTeamRepository.UpdateUserRoleInTeam(userTeam);
            await _userTeamRepository.SaveChangesAsync();

            var teamUserDTO = new TeamUserDTO
            {
                Id = userTeam.User.Id,
                Email = userTeam.User.Email,
                Username = userTeam.User.Username,
                FirstName = userTeam.User.FirstName,
                LastName = userTeam.User.LastName,
                Role = userTeam.Role.ToString()
            };

            return ServiceResult<TeamUserDTO>.Ok(teamUserDTO);
        }




    }
}
