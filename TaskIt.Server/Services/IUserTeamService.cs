namespace TaskIt.Server.Services
{
    public interface IUserTeamService
    {
        Task<bool> IsUserInTeam(int teamId, int userId);
    }
}
