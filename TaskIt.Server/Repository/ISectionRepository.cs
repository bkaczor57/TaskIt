using TaskIt.Server.Core.Entities;

namespace TaskIt.Server.Repository
{
    public interface ISectionRepository
    {
        Task<Sections?> GetSectionById(int sectionId);
        Task<List<Sections>> GetSectionsByTeamId(int teamId);
        void AddSection(Sections section);
        void UpdateSection(Sections section);
        void DeleteSection(Sections section);
        Task<int> SaveChangesAsync();
    }
}
