using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.DTOs.TaskIt.Server.DTOs;
using TaskIt.Server.Repository;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public class TeamInviteService : ITeamInviteService
    {
        private readonly ITeamInvitesRepository _teamInvitesRepository;
        private readonly IUserTeamService _userTeamService;
        private readonly IUserService _userService;
        public TeamInviteService(ITeamInvitesRepository teamInvitesRepository, IUserTeamService userTeamService, IUserService userService)
        {
            _teamInvitesRepository = teamInvitesRepository;
            _userTeamService = userTeamService;
            _userService = userService;
        }
        public async Task<ServiceResult<List<TeamInviteDTO>>> GetAllInvites()
        {
            var invites = await _teamInvitesRepository.getInvites();

            if (invites == null || invites.Count == 0)
                return ServiceResult<List<TeamInviteDTO>>.Fail("No invites found");
            var teamInviteDTO = invites
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
            return ServiceResult<List<TeamInviteDTO>>.Ok(teamInviteDTO);
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

        public async Task<ServiceResult<PagedResult<TeamInviteDTO>>> GetUserInvitesPaged(int userId, int pageNumber, int pageSize, string status)
        {
            var (invites, totalCount) = await _teamInvitesRepository.getUserInvitesPaged(userId, pageNumber, pageSize, status);

            var inviteDtos = invites.Select(ti => new TeamInviteDTO
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
            }).ToList();

            var result = new PagedResult<TeamInviteDTO>
            {
                Items = inviteDtos,
                TotalItems = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                CurrentPage = pageNumber
            };

            return ServiceResult<PagedResult<TeamInviteDTO>>.Ok(result);
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

        public async Task<ServiceResult<TeamInviteDTO>> CreateTeamInvite(TeamInviteRequest teamInviteRequest, int invitingUserId)
        {
            //Check if invitedUserExist
            var userExist = await _userService.GetUserByEmail(teamInviteRequest.InvitedUserEmail);
            if (!userExist.Success || userExist.Data==null)
                return ServiceResult<TeamInviteDTO>.Fail("Invited user does not exist");
            //Check if user is in Team
            var isUserInTeam = await _userTeamService.IsUserInTeam(teamInviteRequest.TeamId, userExist.Data.Id);
            if (isUserInTeam.Success)
                return ServiceResult<TeamInviteDTO>.Fail("User is already in Team");

            //Check if there is Existing Invite that isn't Pending or Accepted
            var isPendingInvite = await _teamInvitesRepository.getTeamInviteByTeamIdAndInvitedId(teamInviteRequest.TeamId, userExist.Data.Id);
            if (isPendingInvite?.Status == InviteStatus.Pending)
                return ServiceResult<TeamInviteDTO>.Fail("Invite was already send");

            if (teamInviteRequest.TeamRole.HasValue && !Enum.IsDefined(typeof(UserTeamRole), teamInviteRequest.TeamRole.Value))
            {
                return ServiceResult<TeamInviteDTO>.Fail("Invalid role specified.");
            }

            var teamInvite = new TeamInvites
            {
                TeamId = teamInviteRequest.TeamId,
                InvitedUserId = userExist.Data.Id,
                InvitingUserId = invitingUserId,
                TeamRole = teamInviteRequest.TeamRole ?? Core.Enums.UserTeamRole.Member,
                InviteDate = DateTime.UtcNow
            };
            _teamInvitesRepository.AddInvitation(teamInvite);
            await _teamInvitesRepository.SaveChangesAsync();

            var savedInvite = await _teamInvitesRepository.getTeamInviteById(teamInvite.Id);

            var teamInviteDTO = new TeamInviteDTO
            {
                Id = savedInvite.Id,
                Team = savedInvite.Team == null ? null : new TeamInviteTeamDTO
                {
                    Id = savedInvite.Team.Id,
                    Name = savedInvite.Team.Name,
                    Description = savedInvite.Team.Description
                },
                InvitedUser = savedInvite.InvitedUser == null ? null : new TeamInviteUserDTO
                {
                    Id = savedInvite.InvitedUser.Id,
                    Email = savedInvite.InvitedUser.Email,
                    Username = savedInvite.InvitedUser.Username,
                    FirstName = savedInvite.InvitedUser.FirstName,
                    LastName = savedInvite.InvitedUser.LastName
                },
                InvitingUser = savedInvite.InvitingUser == null ? null : new TeamInviteUserDTO
                {
                    Id = savedInvite.InvitingUser.Id,
                    Email = savedInvite.InvitingUser.Email,
                    Username = savedInvite.InvitingUser.Username,
                    FirstName = savedInvite.InvitingUser.FirstName,
                    LastName = savedInvite.InvitingUser.LastName
                },
                TeamRole = savedInvite.TeamRole.ToString(),
                Status = savedInvite.Status.ToString(),
                InviteDate = savedInvite.InviteDate,
                ResponseDate = savedInvite.ResponseDate
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
