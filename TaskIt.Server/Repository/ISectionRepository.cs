using TaskIt.Server.Core.Entities;

namespace TaskIt.Server.Repository
{
    public interface ISectionRepository
    {
        Task<Sections?> GetSectionById(int sectionId);
        Task<List<Sections>> GetSectionsByTeamId(int teamId);
        Task<int> GetNextPositionForTeam(int teamId);
        Task<List<Sections>> GetSectionsAfterPosition(int teamId, int position);
        Task<List<Sections>> GetSectionsByTeamIdOrdered(int teamId);

        void AddSection(Sections section);
        void UpdateSection(Sections section);
        void DeleteSection(Sections section);
        Task<int> SaveChangesAsync();
    }
}
