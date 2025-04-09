using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface ITeamInviteService
    {
        Task<ServiceResult<List<TeamInviteDTO>>> GetAllInvites();
        Task<ServiceResult<TeamInviteDTO?>> GetTeamInviteById(int inviteId);
        Task<ServiceResult<List<TeamInviteDTO>>> GetUserInvites(int userId);
        Task<ServiceResult<List<TeamInviteDTO>>> GetTeamInvitesByTeamId(int teamId);
        Task<ServiceResult<TeamInviteDTO>> CreateTeamInvite(TeamInviteRequest teamInviteRequest, int invitingUserId);
        Task<ServiceResult<bool>> UpdateInviteStatus(int inviteId, InviteStatus newStatus);
        Task<ServiceResult<bool>> DeleteInvite(int inviteId);
    }
}
