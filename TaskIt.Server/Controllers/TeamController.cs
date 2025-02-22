using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!); // Pobieramy userId z tokenu
            var result = await _teamService.CreateTeam(userId, teamCreateRequest);
            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetTeam(int teamId)
        {
            // Check if User is Admin or is In the Team
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!); // Pobieramy userId z tokenu
            var isAdmin = User.IsInRole("Admin");

            var isMember = await _userTeamService.IsUserInTeam(userId, teamId);
            var result = await _teamService.GetTeamById(teamId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }


        [HttpDelete("{teamId}")]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!); // Pobieramy userId z tokenu
            var result = await _teamService.DeleteTeam(userId,teamId);

            if (!result.Success)
                return Unauthorized(new { error = result.ErrorMessage });

            return NoContent();
        }

    }
}
