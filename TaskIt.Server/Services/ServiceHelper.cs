namespace TaskIt.Server.Services
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using TaskIt.Server.Core.Enums;


    public class ServiceHelper : IServiceHelper
    {
        private readonly IUserTeamService _userTeamService;
        private readonly ITeamService _teamService;
        private readonly IUserService _userService;

        public ServiceHelper(IUserTeamService userTeamService, ITeamService teamService, IUserService userService)
        {
            _userTeamService = userTeamService;
            _userService = userService;
            _teamService = teamService;
        }

        //Checks if the user is a Global Admin
        public async Task<bool> IsGlobalAdmin(int userId)
        {

            var userRole = await _userService.GetUserRole(userId);
            return userRole.Data == UserRole.Admin;
        }

        //Checks if the user is a Team Admin for a specific team
        public async Task<bool> IsUserRoleOrHigher(int teamId, int userId, UserTeamRole requiredRole)
        {
            var roleResult = await _userTeamService.GetUserRole(teamId, userId);
            if (!roleResult.Success || roleResult.Data == null) 
                return false;
            return roleResult.Success && (int)roleResult.Data >= (int)requiredRole;
        }

        //Checks if the authenticated user is performing an action on themselves
        public async Task<bool> IsSelf(int providedUserId, int targetUserId)
        {
            var user = await _userService.GetUserById(providedUserId);
            return targetUserId == user.Data.Id && user.Success;
        }

        public async Task<bool> IsOwner(int userId, int teamId)
        {
            var isOwner = await _teamService.IsUserOwner(userId , teamId);
            return isOwner.Success && isOwner.Data;
        }

        // Master Function: Checks if the user has any permission to manage a team
        public async Task<bool> CanPerformAction(int providedUserId, int teamId, int resuourceOwnerId, UserTeamRole requiredRole)
        {


            if (await IsGlobalAdmin(providedUserId)) return true; // Global Admins always have access
            if (await IsUserRoleOrHigher(teamId, providedUserId, requiredRole)) return true; // Team Admin check
            if (await IsOwner(providedUserId, teamId)) return true; // Self-management check
            if (resuourceOwnerId == providedUserId) return true;

            return false;
        }

        public async Task<bool> CanPerformAction(int providedUserId, int teamId, int resuourceOwnerId)
        {

            if (await IsGlobalAdmin(providedUserId)) return true; // Global Admins always have access
            if (await IsOwner(providedUserId,teamId)) return true; // Self-management check
            if (resuourceOwnerId == providedUserId) return true;

            return false;
        }

        public async Task<bool> CanPerformAction(int providedUserId ,int teamId, UserTeamRole requiredRole)
        {

            if (await IsGlobalAdmin(providedUserId)) return true; // Global Admins always have access
            if (await IsUserRoleOrHigher(teamId, providedUserId, requiredRole)) return true; // Team Admin check
            if (await IsOwner(providedUserId,teamId)) return true; // Self-management check
            return false;
        }

        public async Task<bool> CanPerformAction(int providedUserId, int teamId)
        {

            if (await IsGlobalAdmin(providedUserId)) return true; // Global Admins always have access
            if (await IsOwner(providedUserId,teamId)) return true; // Self-management check

            return false;
        }




    }

}
