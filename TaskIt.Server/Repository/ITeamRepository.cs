using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;

namespace TaskIt.Server.Repository
{
    public interface ITeamRepository
    {
             
        Task<Teams?> GetTeamById(int teamId);
        Task<List<Teams?>> GetTeamsByOwnerId(int ownerId);
        void AddTeam(Teams team);
        void UpdateTeam(Teams team);
        void DeleteTeam(Teams team);
        Task<int> SaveChangesAsync();

    }
}
