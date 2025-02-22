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

        public async Task<Teams?> GetTeamByOwnerId(int ownerId)
        {
            return await _context.Teams.FirstOrDefaultAsync(t => t.OwnerId == ownerId);
        }


        public async Task AddTeam(Teams team)
        {
            await _context.Teams.AddAsync(team);
        }

        public async Task UpdateTeamAsync(Teams team)
        {
            _context.Teams.Update(team);
        }

        public async Task DeleteTeamAsync(Teams team)
        {
            _context.Teams.Remove(team);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }




    }
}
