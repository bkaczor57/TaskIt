using Microsoft.EntityFrameworkCore;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.Data;

public class UserTeamRepository : IUserTeamRepository
{
    private readonly AppDbContext _context;

    public UserTeamRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UsersTeams?> GetUserTeam(int teamId, int userId)
    {
        return await _context.UsersTeams
            .FirstOrDefaultAsync(ut => ut.TeamId == teamId && ut.UserId == userId);
    }

    public async Task<UserTeamRole?> GetUserRole(int teamId, int userId)
    {
        return await _context.UsersTeams
            .Where(ut => ut.TeamId == teamId && ut.UserId == userId)
            .Select(ut => ut.Role)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Users?>> GetUsersByTeamId(int teamId)
    {
        return await _context.UsersTeams
            .Where(ut => ut.TeamId == teamId)
            .Select(ut => ut.User)
            .ToListAsync();
    }

    public async Task<List<Teams?>> GetTeamsByUserId(int userId)
    {
        return await _context.UsersTeams
            .Where(ut => ut.UserId == userId)
            .Select(ut => ut.Team)
            .ToListAsync();
    }

    public void AddUserToTeam(UsersTeams userTeam)
    {
        _context.UsersTeams.Add(userTeam);
    }

    public void DeleteUserFromTeam(UsersTeams userTeam)
    {
         _context.UsersTeams.Remove(userTeam);
    }

    public void UpdateUserRoleInTeam(UsersTeams userTeam)
    {
        _context.UsersTeams.Update(userTeam);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
