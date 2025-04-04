using TaskIt.Server.Core.Entities;

namespace TaskIt.Server.Repository
{
    public interface ITeamInvitesRepository
    {
        Task<List<TeamInvites>>getInvites();
        Task<TeamInvites?> getTeamInviteByTeamIdAndInvitedId(int teamId, int invitedUserId);
        Task<TeamInvites?> getTeamInviteById(int inviteId);
        Task<List<TeamInvites>> getTeamInvitesByTeamId(int teamId);
        Task<List<TeamInvites>> getUserInvites(int userId);
        void AddInvitation(TeamInvites teamInvites);
        void UpdateInvitation(TeamInvites teamInvites);
        void DeleteInvitation(TeamInvites teamInvites);
        Task<int> SaveChangesAsync();

    }
}
