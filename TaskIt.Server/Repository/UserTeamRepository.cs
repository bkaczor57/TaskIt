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


    public async Task<bool> IsUserInTeamAsync(int teamId, int userId)
    {
        return await _context.UsersTeams
            .AnyAsync(ut => ut.TeamId == teamId && ut.UserId == userId);
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

    public async Task AddUserToTeamAsync(int teamId, int userId, UserTeamRole role)
    {
        var userTeam = new UsersTeams
        {
            TeamId = teamId,
            UserId = userId,
            Role = role
        };
        await _context.UsersTeams.AddAsync(userTeam);
    }

    public async Task AddUserToTeamAsync(int teamId, int userId)
    {
        var userTeam = new UsersTeams
        {
            TeamId = teamId,
            UserId = userId,
        };
        await _context.UsersTeams.AddAsync(userTeam);
    }

    public async Task RemoveUserFromTeamAsync(int teamId, int userId)
    {
        var userTeam = await _context.UsersTeams
            .FirstOrDefaultAsync(ut => ut.TeamId == teamId && ut.UserId == userId);

        if (userTeam != null)
        {
            _context.UsersTeams.Remove(userTeam);
        }
    }

    public async Task UpdateUserRoleInTeamAsync(int teamId, int userId, UserTeamRole newRole)
    {
        var userTeam = await _context.UsersTeams
            .FirstOrDefaultAsync(ut => ut.TeamId == teamId && ut.UserId == userId);

        if (userTeam != null)
        {
            userTeam.Role = newRole;
            _context.UsersTeams.Update(userTeam);
        }
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
