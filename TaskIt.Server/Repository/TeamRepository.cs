using Microsoft.EntityFrameworkCore;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Data;

namespace TaskIt.Server.Repository
{
    public class TeamRepository : ITeamRepository
    {
        private readonly AppDbContext _context;
        public TeamRepository(AppDbContext context) 
        {
            _context = context;
        }

        public async Task<Teams?> GetTeamById(int teamId)
        {
            return await _context.Teams.FirstOrDefaultAsync(t => t.Id == teamId);
        }

        public async Task<List<Teams>> GetTeamsByOwnerId(int ownerId)
        {
            return await _context.Teams
                .Where(t => t.OwnerId == ownerId)
                .ToListAsync();
        }


        public void AddTeam(Teams team)
        {
            _context.Teams.Add(team);
        }

        public void UpdateTeam(Teams team)
        {
            _context.Teams.Update(team);
        }

        public void DeleteTeam(Teams team)
        {
            _context.Teams.Remove(team);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }




    }
}
