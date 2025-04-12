using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;
using System.Security.Claims;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.Requests;
using TaskIt.Server.Services;

namespace TaskIt.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TeamInviteController : ControllerBase
    {
        private readonly ITeamInviteService _teamInviteService;
        private readonly IServiceHelper _serviceHelper;

        public TeamInviteController(ITeamInviteService teamInviteService, IServiceHelper serviceHelper)
        {
            _teamInviteService = teamInviteService;
            _serviceHelper = serviceHelper;
        }

        // Stworzenie nowego zaproszenia
        [HttpPost]
        public async Task<IActionResult> CreateInvite([FromBody] TeamInviteRequest teamInviteRequest)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamInviteRequest.TeamId, UserTeamRole.Manager))
            {
                return Unauthorized(new { error = "You don't have permission to send invites to this team" });
            }

            var result = await _teamInviteService.CreateTeamInvite(teamInviteRequest, GetUserId());

            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        // Pobranie wszystkich zaproszeń użytkownika (do niego wysłanych)
        [HttpGet("user")]
        public async Task<IActionResult> GetUserInvites()
        {
            var result = await _teamInviteService.GetUserInvites(GetUserId());

            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpGet("user-paged")]
        public async Task<IActionResult> GetUserInvitesPaged([FromQuery] InviteQueryRequest request)
        {
            var result = await _teamInviteService.GetUserInvitesPaged(
                GetUserId(),
                request.PageNumber,
                request.PageSize,
                request.Status
            );

            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        // Pobranie wszystkich zaproszeń dla konkretnego zespołu
        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetTeamInvites(int teamId)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Admin))
            {
                return Unauthorized(new { error = "You don't have permission to view invites for this team" });
            }

            var result = await _teamInviteService.GetTeamInvitesByTeamId(teamId);

            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        // Akceptowanie zaproszenia
        [HttpPut("{inviteId}/accept")]
        public async Task<IActionResult> AcceptInvite(int inviteId)
        {
            var invite = await _teamInviteService.GetTeamInviteById(inviteId);

            if (!invite.Success)
                return NotFound(new { error = invite.ErrorMessage });

            if (invite.Data == null)
                return NotFound(new { error = "Invite not found" });

            if (invite.Data.InvitedUser?.Id != GetUserId())
            {
                return Unauthorized(new { error = "You are not authorized to accept this invite" });
            }

            var result = await _teamInviteService.UpdateInviteStatus(inviteId, InviteStatus.Accepted);

            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok();
        }

        // Odrzucanie zaproszenia
        [HttpPut("{inviteId}/decline")]
        public async Task<IActionResult> DeclineInvite(int inviteId)
        {
            var invite = await _teamInviteService.GetTeamInviteById(inviteId);

            if (!invite.Success)
                return NotFound(new { error = invite.ErrorMessage });

            if (invite.Data == null)
                return NotFound(new { error = "Invite not found" });

            if (invite.Data.InvitedUser?.Id != GetUserId())
            {
                return Unauthorized(new { error = "You are not authorized to decline this invite" });
            }

            var result = await _teamInviteService.UpdateInviteStatus(inviteId, InviteStatus.Declined);

            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok();
        }

        // Usunięcie zaproszenia
        [HttpDelete("{inviteId}")]
        public async Task<IActionResult> DeleteInvite(int inviteId)
        {

            var inviteResult = await _teamInviteService.GetTeamInviteById(inviteId);

            if (!inviteResult.Success || inviteResult.Data == null)
                return NotFound(new { error = inviteResult.ErrorMessage });


            if (!await _serviceHelper.CanPerformAction(GetUserId(), inviteResult.Data.Team.Id, inviteResult.Data.InvitedUser.Id, UserTeamRole.Admin))
            {
                return Unauthorized(new { error = "You don't have permission to delete this invite" });
            }

            var result = await _teamInviteService.DeleteInvite(inviteId);

            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return NoContent();
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        }
    }
}
