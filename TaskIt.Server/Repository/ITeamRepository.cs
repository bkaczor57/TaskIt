using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;

namespace TaskIt.Server.Repository
{
    public interface ITeamRepository
    {
             
        Task<Teams?> GetTeamById(int teamId);
        Task<Teams?> GetTeamByOwnerId(int ownerId);

        Task AddTeam(Teams team);
        Task UpdateTeamAsync(Teams team);
        Task DeleteTeamAsync(Teams team);

        Task<int> SaveChangesAsync();

    }
}
