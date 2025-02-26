using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Globalization;
using System.Security.Claims;
using TaskIt.Server.Requests;
using TaskIt.Server.Services;

namespace TaskIt.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {

        private readonly ITeamService  _teamService;
        private readonly IUserTeamService _userTeamService;

        public TeamController(ITeamService teamService, IUserTeamService userTeamService)
        {
            _teamService = teamService;
            _userTeamService = userTeamService;

        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] TeamCreateRequest teamCreateRequest)
        {
            var userId = GetUserId();
            var result = await _teamService.CreateTeam(userId, teamCreateRequest);
            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetTeam(int teamId)
        {
            // Check if User is Admin or is In the Team
            var userId = GetUserId();
            var isAdmin = User.IsInRole("Admin");
            var isMemberResult =  _userTeamService.IsUserInTeam(teamId, userId);
            var isMember = isMemberResult.Success && isMemberResult.Data;

            if (!isAdmin && !isMember)
                return Unauthorized(new { error = "You are not a member of this team" });


            var result = await _teamService.GetTeamById(teamId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpGet("{teamId}/members")]
        public async Task<IActionResult> GetTeamMembers(int teamId)
        {
            var userId = GetUserId();
            var isAdmin = User.IsInRole("Admin");
            var isMemberResult =  _userTeamService.IsUserInTeam(teamId,userId);
            bool isMember = isMemberResult.Success && isMemberResult.Data;

            if (!isAdmin && !isMember)
                return Unauthorized(new { error = "You are not a member of this team" });
            var result = await _userTeamService.GetUsersByTeamId(teamId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }


        [HttpDelete("{teamId}")]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            var userId = GetUserId();

            var isAdmin = User.IsInRole("Admin");
            var isOwnerResult = await _teamService.IsUserOwner(userId, teamId);
            var isOwner = isOwnerResult.Success && isOwnerResult.Data;

            if (!isAdmin && !isOwner)
                return Unauthorized(new {error = "You are not a owner or admin of this team" });


            var result = await _teamService.DeleteTeam(teamId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return NoContent();
        }

        [HttpPut("{teamId}")]
        public async Task<IActionResult> UpdateTeam([FromBody] TeamUpdateRequest updateRequest, int teamId)
        {
            var userId = GetUserId();

            var isAdmin = User.IsInRole("Admin");
            var isOwnerResult = await _teamService.IsUserOwner(userId, teamId);
            var isOwner = isOwnerResult.Success && isOwnerResult.Data;

            if (isAdmin && !isOwner)
                return Unauthorized(new { error = "You are not a owner or admin of this team" });

            var result = await _teamService.UpdateTeam(teamId, updateRequest);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }


        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        }
    }
}
