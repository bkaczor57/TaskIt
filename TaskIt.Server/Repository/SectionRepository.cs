using Microsoft.EntityFrameworkCore;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Data;

namespace TaskIt.Server.Repository
{
    public class SectionRepository: ISectionRepository
    {
        private readonly AppDbContext _context;
        public SectionRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<int> GetNextPositionForTeam(int teamId)
        {
            var max = await _context.Sections
                         .Where(s => s.TeamId == teamId)
                         .MaxAsync(s => (int?)s.Position) ?? 0;
            return max + 1;
        }


        public async Task<List<Sections>> GetSectionsAfterPosition(int teamId, int position)
        {
            return await _context.Sections
                .Where(s => s.TeamId == teamId && s.Position > position)
                .ToListAsync();
        }

        public async Task<List<Sections>> GetSectionsByTeamIdOrdered(int teamId)
        {
            return await _context.Sections
                        .Where(s => s.TeamId == teamId)
                        .OrderBy(s => s.Position)
                        .ToListAsync();
        }
        public async Task<Sections?> GetSectionById(int sectionId)
        {
            return await _context.Sections.FirstOrDefaultAsync(s => s.Id == sectionId);
        }
        public async Task<List<Sections>> GetSectionsByTeamId(int teamId)
        {
            return await _context.Sections
                .Where(s => s.TeamId == teamId)
                .ToListAsync();
        }
        public void AddSection(Sections section)
        {
            _context.Sections.Add(section);
        }
        public void UpdateSection(Sections section)
        {
            _context.Sections.Update(section);
        }
        public void DeleteSection(Sections section)
        {
            _context.Sections.Remove(section);
        }
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }



    }
}
