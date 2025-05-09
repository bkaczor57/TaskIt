using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskIt.Server.Requests;
using TaskIt.Server.Services;

namespace TaskIt.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserTeamController : ControllerBase
    {

        private readonly IUserTeamService _userTeamService;
        private readonly IServiceHelper _serviceHelper;
        public UserTeamController(IUserTeamService userTeamService, IServiceHelper serviceHelper)
        {
            _userTeamService = userTeamService;
            _serviceHelper = serviceHelper;
        }

        //Jedynie testowe, nie będzie możliwości dodania bezpośrednio do teamu bez akceptacji zaproszenia przez użytkownika, ew. tylko przez globalnego admina
        [HttpPost]
        public async Task<IActionResult> AddUserToTeam([FromBody] UserTeamAddRequest userTeamAddRequest)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), userTeamAddRequest.TeamId, Core.Enums.UserTeamRole.Manager))
            {
                return Forbid();
            }

            var result = await _userTeamService.AddUserToTeam(userTeamAddRequest);

            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpGet("team/{teamId}/user/{userId}")]
        public async Task<IActionResult> GetUserInTeam(int teamId, int userId)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, Core.Enums.UserTeamRole.Member))
            {
                return Forbid();
            }

            var result = await _userTeamService.GetUserInTeam(teamId, userId);

            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });



            return Ok(result.Data);
        }

        [HttpGet("user/teams")]
        public async Task<IActionResult> GetUserTeams()
        {
            var result = await _userTeamService.GetTeamsByUserId(GetUserId());

            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }


        [HttpGet("team/{teamId}/users")]
        public async Task<IActionResult> GetAllUsers(int teamId)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, Core.Enums.UserTeamRole.Member))
            {
                return Forbid();
            }
            var result = await _userTeamService.GetUsersByTeamId(teamId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpGet("user/{userId}/teams")]
        public async Task<IActionResult> GetAllTeams(int userId)
        {
            if (!await _serviceHelper.IsSelf(GetUserId(),userId)&&!await _serviceHelper.IsGlobalAdmin(GetUserId()))
            {
                return Forbid();
            }
            var result = await _userTeamService.GetTeamsByUserId(userId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpDelete("team/{teamId}/user/{userId}")]
        public async Task<IActionResult> RemoveUserFromTeam(int teamId, int userId)
        {

            if(await _serviceHelper.IsOwner(userId,teamId))
            {
                return BadRequest(new { error = "You can't remove the owner of the team" });
            }
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, userId , Core.Enums.UserTeamRole.Admin))
            {
                return Forbid();
            }
            var result = await _userTeamService.DeleteUserFromTeam(teamId, userId);
            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpPut("team/{teamId}/user/{userId}")]
        public async Task<IActionResult> UpdateUserRoleInTeam(int teamId, int userId, [FromBody] UserTeamUpdateRequest userTeamUpdateRequest)
        {
            if(await _serviceHelper.IsOwner(userId, teamId))
            {
                return BadRequest(new { error = "You can't change the role of the owner of the team" });
            }

            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, Core.Enums.UserTeamRole.Admin))
            {
                return Forbid();
            }

            if (userId == GetUserId())
            {
                return BadRequest(new { error = "You can't change your own role" });
            }
            var result = await _userTeamService.UpdateUserRoleInTeam(teamId, userId, userTeamUpdateRequest);
            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        }
    }
}
