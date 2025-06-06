﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Globalization;
using System.Security.Claims;
using TaskIt.Server.Core.Enums;
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
        private readonly IServiceHelper _servicerHelper;

        public TeamController(ITeamService teamService, IServiceHelper servicerHelper)
        {
            _teamService = teamService;
            _servicerHelper = servicerHelper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] TeamCreateRequest teamCreateRequest)
        {
            var result = await _teamService.CreateTeam(GetUserId(), teamCreateRequest);
            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetTeam(int teamId)
        {
            // Check if User is Admin or is In the Team
            if (!await _servicerHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Member))
                return Forbid();

            var result = await _teamService.GetTeamById(teamId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpDelete("{teamId}")]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            if (!await _servicerHelper.CanPerformAction(GetUserId(),teamId))
                return Forbid();


            var result = await _teamService.DeleteTeam(teamId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return NoContent();
        }

        [HttpPut("{teamId}")]
        public async Task<IActionResult> UpdateTeam([FromBody] TeamUpdateRequest updateRequest, int teamId)
        {
            if (!await _servicerHelper.CanPerformAction(GetUserId(), teamId))
                return Forbid();

            var result = await _teamService.UpdateTeam(teamId, updateRequest);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpPut("{teamId}/change-owner")]
        public async Task<IActionResult> ChangeOwnerOfTeam([FromBody] TeamChangeOwnerRequest updateRequest, int teamId)
        {
            if (!await _servicerHelper.CanPerformAction(GetUserId(), teamId))
                return Forbid();

            var result = await _teamService.ChangeOwner(teamId, updateRequest);
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
