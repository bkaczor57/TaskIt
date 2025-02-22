using TaskIt.Server.Repository;

namespace TaskIt.Server.Services
{
    public class UserTeamService : IUserTeamService
    {
        private readonly IUserTeamRepository _userTeamRepository;

        public UserTeamService(IUserTeamRepository userTeamRepository)
        {
            _userTeamRepository = userTeamRepository;
        }
        public async Task<bool> IsUserInTeam(int teamId, int userId)
        {
            return await _userTeamRepository.IsUserInTeamAsync(teamId, userId);
        }
    }
}
