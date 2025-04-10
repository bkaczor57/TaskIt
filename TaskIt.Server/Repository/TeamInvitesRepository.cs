using Microsoft.EntityFrameworkCore;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Data;

namespace TaskIt.Server.Repository
{
    public class TeamInvitesRepository : ITeamInvitesRepository
    {
        private readonly AppDbContext _context;
        public TeamInvitesRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<TeamInvites>> getInvites()
        {
            return await _context.TeamInvites
                .Include(ti => ti.InvitingUser)
                .Include(ti => ti.InvitedUser)
                .Include(ti => ti.Team)
                .ToListAsync();
        }

        public async Task<(List<TeamInvites> Invites, int TotalCount)> getUserInvitesPaged(int userId, int pageNumber, int pageSize, string status)
        {
            var query = _context.TeamInvites
                .Include(ti => ti.InvitingUser)
                .Include(ti => ti.InvitedUser)
                .Include(ti => ti.Team)
                .Where(ti => ti.InvitedUserId == userId);

            if (!string.Equals(status, "All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(ti => ti.Status.ToString() == status);
            }

            var totalCount = await query.CountAsync();

            var invites = await query
                .OrderByDescending(ti => ti.InviteDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (invites, totalCount);
        }


        public async Task<TeamInvites?> getTeamInviteByTeamIdAndInvitedId(int teamId, int invitedUserId)
        {
            return await _context.TeamInvites
                .Include(ti => ti.InvitingUser)
                .Include(ti => ti.InvitedUser)
                .Include(ti => ti.Team)
                .FirstOrDefaultAsync(ti => ti.TeamId == teamId && ti.InvitedUserId == invitedUserId);
        }

        public async Task<TeamInvites?> getTeamInviteById(int inviteId)
        {
            return await _context.TeamInvites
                .Include(ti => ti.InvitingUser)
                .Include(ti => ti.InvitedUser)
                .Include(ti => ti.Team)
                .FirstOrDefaultAsync(ti => ti.Id == inviteId);
        }

        public async Task<List<TeamInvites>> getTeamInvitesByTeamId(int teamId)
        {
            return await _context.TeamInvites
                .Include(ti => ti.InvitingUser)
                .Include(ti => ti.InvitedUser)
                .Include(ti => ti.Team)
                .Where(ti => ti.TeamId == teamId)
                .ToListAsync();
        }

        public async Task<List<TeamInvites>> getUserInvites(int userId)
        {
            return await _context.TeamInvites
                .Include(ti => ti.InvitingUser)
                .Include(ti => ti.InvitedUser)
                .Include(ti => ti.Team)
                .Where(ti => ti.InvitedUserId == userId)
                .ToListAsync();
        }





        public void AddInvitation(TeamInvites teamInvites)
        {
            _context.TeamInvites.Add(teamInvites);
        }

        public void UpdateInvitation(TeamInvites teamInvites)
        {
            _context.TeamInvites.Update(teamInvites);
        }

        public void DeleteInvitation(TeamInvites teamInvites)
        {
            _context.TeamInvites.Remove(teamInvites);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

    }
}

