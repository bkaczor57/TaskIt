using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;

public interface IUserTeamRepository
{

    Task<UsersTeams?> GetUserTeam(int teamId, int userId);
    Task<List<UsersTeams>> GetTeamsByUserId(int userId);
    Task<List<UsersTeams>> GetUsersByTeamId(int teamId);
    Task<UserTeamRole?> GetUserRole(int teamId, int userId);
    void AddUserToTeam(UsersTeams userTeams);
    void DeleteUserFromTeam(UsersTeams userTeams);
    void UpdateUserRoleInTeam(UsersTeams userTeams);
    Task SaveChangesAsync();
}
