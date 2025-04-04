using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.Repository;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public class TeamInviteService
    {
        private readonly ITeamInvitesRepository _teamInvitesRepository;
        private readonly IUserTeamService _userTeamService;
        public TeamInviteService(ITeamInvitesRepository teamInvitesRepository, IUserTeamService userTeamService)
        {
            _teamInvitesRepository = teamInvitesRepository;
            _userTeamService = userTeamService;
        }
        public async Task<ServiceResult<List<TeamInviteDTO>>> GetAllInvites()
        {
            var invites = await _teamInvitesRepository.getInvites();

            if (invites == null || invites.Count == 0)
                return ServiceResult<List<TeamInviteDTO>>.Fail("No invites found");
            var TeamInviteDTO = invites
                .Select(ti => new TeamInviteDTO
                {
                    Id = ti.Id,
                    Team = ti.Team == null ? null : new TeamInviteTeamDTO
                    {
                        Id = ti.Team.Id,
                        Name = ti.Team.Name,
                        Description = ti.Team.Description
                    },
                    InvitedUser = ti.InvitedUser == null ? null : new TeamInviteUserDTO
                    {
                        Id = ti.InvitedUser.Id,
                        Email = ti.InvitedUser.Email,
                        Username = ti.InvitedUser.Username,
                        FirstName = ti.InvitedUser.FirstName,
                        LastName = ti.InvitedUser.LastName
                    },
                    InvitingUser = ti.InvitingUser == null ? null : new TeamInviteUserDTO
                    {
                        Id = ti.InvitingUser.Id,
                        Email = ti.InvitingUser.Email,
                        Username = ti.InvitingUser.Username,
                        FirstName = ti.InvitingUser.FirstName,
                        LastName = ti.InvitingUser.LastName
                    },
                    TeamRole = ti.TeamRole.ToString(),
                    Status = ti.Status.ToString(),
                    InviteDate = ti.InviteDate,
                    ResponseDate = ti.ResponseDate
                })
               .ToList();
            return ServiceResult<List<TeamInviteDTO>>.Ok(TeamInviteDTO);
        }
        public async Task<ServiceResult<TeamInviteDTO?>> GetTeamInviteById(int inviteId)
        {
            var ti = await _teamInvitesRepository.getTeamInviteById(inviteId);
            if (ti == null)
                return ServiceResult<TeamInviteDTO?>.Fail("Invite not found");
            var teamInviteDTO = new TeamInviteDTO
            {
                Id = ti.Id,
                Team = ti.Team == null ? null : new TeamInviteTeamDTO
                {
                    Id = ti.Team.Id,
                    Name = ti.Team.Name,
                    Description = ti.Team.Description
                },
                InvitedUser = ti.InvitedUser == null ? null : new TeamInviteUserDTO
                {
                    Id = ti.InvitedUser.Id,
                    Email = ti.InvitedUser.Email,
                    Username = ti.InvitedUser.Username,
                    FirstName = ti.InvitedUser.FirstName,
                    LastName = ti.InvitedUser.LastName
                },
                InvitingUser = ti.InvitingUser == null ? null : new TeamInviteUserDTO
                {
                    Id = ti.InvitingUser.Id,
                    Email = ti.InvitingUser.Email,
                    Username = ti.InvitingUser.Username,
                    FirstName = ti.InvitingUser.FirstName,
                    LastName = ti.InvitingUser.LastName
                },
                TeamRole = ti.TeamRole.ToString(),
                Status = ti.Status.ToString(),
                InviteDate = ti.InviteDate,
                ResponseDate = ti.ResponseDate
            };

            return ServiceResult<TeamInviteDTO?>.Ok(teamInviteDTO);
        }
        public async Task<ServiceResult<List<TeamInviteDTO>>> GetUserInvites(int userId)
        {
            var invites = await _teamInvitesRepository.getUserInvites(userId);
            if (invites == null || invites.Count == 0)
                return ServiceResult<List<TeamInviteDTO>>.Fail("No invites found");
            var TeamInviteDTO = invites
                .Select(ti => new TeamInviteDTO
                {
                    Id = ti.Id,
                    Team = ti.Team == null ? null : new TeamInviteTeamDTO
                    {
                        Id = ti.Team.Id,
                        Name = ti.Team.Name,
                        Description = ti.Team.Description
                    },
                    InvitedUser = ti.InvitedUser == null ? null : new TeamInviteUserDTO
                    {
                        Id = ti.InvitedUser.Id,
                        Email = ti.InvitedUser.Email,
                        Username = ti.InvitedUser.Username,
                        FirstName = ti.InvitedUser.FirstName,
                        LastName = ti.InvitedUser.LastName
                    },
                    InvitingUser = ti.InvitingUser == null ? null : new TeamInviteUserDTO
                    {
                        Id = ti.InvitingUser.Id,
                        Email = ti.InvitingUser.Email,
                        Username = ti.InvitingUser.Username,
                        FirstName = ti.InvitingUser.FirstName,
                        LastName = ti.InvitingUser.LastName
                    },
                    TeamRole = ti.TeamRole.ToString(),
                    Status = ti.Status.ToString(),
                    InviteDate = ti.InviteDate,
                    ResponseDate = ti.ResponseDate
                })
               .ToList();
            return ServiceResult<List<TeamInviteDTO>>.Ok(TeamInviteDTO);
        }
        public async Task<ServiceResult<List<TeamInviteDTO>>> GetTeamInvitesByTeamId(int teamId)
        {
            var invites = await _teamInvitesRepository.getTeamInvitesByTeamId(teamId);
            if (invites == null || invites.Count == 0)
                return ServiceResult<List<TeamInviteDTO>>.Fail("No invites found");
            var TeamInviteDTO = invites
                .Select(ti => new TeamInviteDTO
                {
                    Id = ti.Id,
                    Team = ti.Team == null ? null : new TeamInviteTeamDTO
                    {
                        Id = ti.Team.Id,
                        Name = ti.Team.Name,
                        Description = ti.Team.Description
                    },
                    InvitedUser = ti.InvitedUser == null ? null : new TeamInviteUserDTO
                    {
                        Id = ti.InvitedUser.Id,
                        Email = ti.InvitedUser.Email,
                        Username = ti.InvitedUser.Username,
                        FirstName = ti.InvitedUser.FirstName,
                        LastName = ti.InvitedUser.LastName
                    },
                    InvitingUser = ti.InvitingUser == null ? null : new TeamInviteUserDTO
                    {
                        Id = ti.InvitingUser.Id,
                        Email = ti.InvitingUser.Email,
                        Username = ti.InvitingUser.Username,
                        FirstName = ti.InvitingUser.FirstName,
                        LastName = ti.InvitingUser.LastName
                    },
                    TeamRole = ti.TeamRole.ToString(),
                    Status = ti.Status.ToString(),
                    InviteDate = ti.InviteDate,
                    ResponseDate = ti.ResponseDate
                })
               .ToList();
            return ServiceResult<List<TeamInviteDTO>>.Ok(TeamInviteDTO);
        }

        public async Task<ServiceResult<TeamInviteDTO>> CreateTeamInvite(TeamInviteRequest teamInviteRequest)
        {
            

            //Check if user is in Team
            var isUserInTeam = await _userTeamService.IsUserInTeam(teamInviteRequest.TeamId, teamInviteRequest.InvitedUserId);

            if (isUserInTeam.Success)
                return ServiceResult<TeamInviteDTO>.Fail("User is already in Team");

            //Check if there is Existing Invite that isn't Pending or Accepted
            var isPendingInvite = await _teamInvitesRepository.getTeamInviteByTeamIdAndInvitedId(teamInviteRequest.TeamId, teamInviteRequest.InvitedUserId);

            if (isPendingInvite?.Status == InviteStatus.Pending)
                return ServiceResult<TeamInviteDTO>.Fail("Invite was already send");

            var teamInvite = new TeamInvites
            {
                TeamId = teamInviteRequest.TeamId,
                InvitedUserId = teamInviteRequest.InvitedUserId,
                InvitingUserId = teamInviteRequest.InvitingUserId,
                TeamRole = teamInviteRequest.TeamRole ?? Core.Enums.UserTeamRole.Member,
                InviteDate = DateTime.UtcNow
            };
            _teamInvitesRepository.AddInvitation(teamInvite);
            await _teamInvitesRepository.SaveChangesAsync();

            var teamInviteDTO = new TeamInviteDTO
            {
                Id = teamInvite.Id,
                Team = teamInvite.Team == null ? null : new TeamInviteTeamDTO
                {
                    Id = teamInvite.Team.Id,
                    Name = teamInvite.Team.Name,
                    Description = teamInvite.Team.Description
                },
                InvitedUser = teamInvite.InvitedUser == null ? null : new TeamInviteUserDTO
                {
                    Id = teamInvite.InvitedUser.Id,
                    Email = teamInvite.InvitedUser.Email,
                    Username = teamInvite.InvitedUser.Username,
                    FirstName = teamInvite.InvitedUser.FirstName,
                    LastName = teamInvite.InvitedUser.LastName
                },
                InvitingUser = teamInvite.InvitingUser == null ? null : new TeamInviteUserDTO
                {
                    Id = teamInvite.InvitingUser.Id,
                    Email = teamInvite.InvitingUser.Email,
                    Username = teamInvite.InvitingUser.Username,
                    FirstName = teamInvite.InvitingUser.FirstName,
                    LastName = teamInvite.InvitingUser.LastName
                },
                TeamRole = teamInvite.TeamRole.ToString(),
                Status = teamInvite.Status.ToString(),
                InviteDate = teamInvite.InviteDate,
                ResponseDate = teamInvite.ResponseDate
            };
            return ServiceResult<TeamInviteDTO>.Ok(teamInviteDTO);
        }

        public async Task<ServiceResult<bool>> UpdateInviteStatus(int inviteId, InviteStatus newStatus)
        {
            var invite = await _teamInvitesRepository.getTeamInviteById(inviteId);

            if (invite == null)
                return ServiceResult<bool>.Fail("Invite not found");

            if (invite.Status != InviteStatus.Pending)
                return ServiceResult<bool>.Fail("Invite is already responded to");

            invite.Status = newStatus;
            invite.ResponseDate = DateTime.UtcNow;

            if (newStatus == InviteStatus.Accepted)
            {
                var result = await _userTeamService.AddUserToTeam(new UserTeamAddRequest
                {
                    TeamId = invite.TeamId,
                    UserId = invite.InvitedUserId,
                    Role = invite.TeamRole // np. Member, Admin
                });

                if (!result.Success)
                {
                    return ServiceResult<bool>.Fail(result.ErrorMessage ?? "Failed to add user to team");
                }
            }

            await _teamInvitesRepository.SaveChangesAsync();

            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> DeleteInvite(int inviteId)
        {
            var teamInvite = await _teamInvitesRepository.getTeamInviteById(inviteId);

            if (teamInvite == null)
            {
                return ServiceResult<bool>.Fail("Invite not found");
            }

            _teamInvitesRepository.DeleteInvitation(teamInvite);
            await _teamInvitesRepository.SaveChangesAsync();

            return ServiceResult<bool>.Ok(true);
        }

    }
}
