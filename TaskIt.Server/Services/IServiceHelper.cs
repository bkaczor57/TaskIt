using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Services
{
    public interface IServiceHelper
    {
        Task<bool> IsGlobalAdmin(int userId);
        Task<bool> IsSelf(int providedUserId, int targetUserId);
        Task<bool> IsUserRoleOrHigher(int teamId, int userId, UserTeamRole requiredRole);
        Task<bool> IsOwner(int userId, int teamId);
        Task<bool> CanPerformAction(int providedUserId, int teamId, int targetUserId, UserTeamRole requiredRole);
        Task<bool> CanPerformAction(int providedUserId, int teamId, UserTeamRole requiredRole);
        Task<bool> CanPerformAction(int providedUserId, int teamId, int targetUserId);
        Task<bool> CanPerformAction(int providedUserId, int teamId);



    }
}
