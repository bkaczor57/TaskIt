using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;

public interface IUserTeamRepository
{

    Task<List<Teams?>> GetTeamsByUserId(int userId);
    Task<List<Users?>> GetUsersByTeamId(int teamId);
    Task AddUserToTeamAsync(int teamId, int userId);
    Task AddUserToTeamAsync(int teamId, int userId, UserTeamRole role); // Domyślna rola
    Task<bool> IsUserInTeamAsync(int teamId, int userId);
    Task RemoveUserFromTeamAsync(int teamId, int userId);
    Task UpdateUserRoleInTeamAsync(int teamId, int userId, UserTeamRole newRole);
    Task SaveChangesAsync();
}
