using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.Requests;
using TaskIt.Server.Services;

namespace TaskIt.Server.Controllers
{
    [Route("api/Team/{teamId}/sections")]
    [ApiController]
    public class SectionController : ControllerBase
    {
        private readonly IServiceHelper _serviceHelper;
        private readonly ISectionService _sectionService;

        public SectionController(IServiceHelper serviceHelper, ISectionService sectionService)
        {
            _serviceHelper = serviceHelper;
            _sectionService = sectionService;
        }


        [HttpPost]
        public async Task<IActionResult> CreateSection(int teamId, [FromBody] SectionCreateRequest sectionCreateRequest)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Admin))
                return Unauthorized(new { error = "You don't have permission to do this action" });
            var result = await _sectionService.CreateSection(teamId, sectionCreateRequest);
            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpGet]
        public async Task<IActionResult> GetSections(int teamId)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Member))
                return Unauthorized(new { error = "You don't have permission to do this action" });
            var result = await _sectionService.GetSectionsByTeamId(teamId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }


        [HttpGet("{sectionId}")]
        public async Task<IActionResult> GetSection(int teamId, int sectionId)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Member))
                return Unauthorized(new { error = "You don't have permission to do this action" });
            var result = await _sectionService.GetSectionById(sectionId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }


        [HttpDelete("{sectionId}")]
        public async Task<IActionResult> DeleteSection(int teamId, int sectionId)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Admin))
                return Unauthorized(new { error = "You don't have permission to do this action" });
            var result = await _sectionService.DeleteSection(sectionId);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpPut("{sectionId}")]
        public async Task<IActionResult> UpdateSection(int teamId, int sectionId, [FromBody] SectionCreateRequest sectionUpdateRequest)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Admin))
                return Unauthorized(new { error = "You don't have permission to do this action" });
            var result = await _sectionService.UpdateSection(sectionId, sectionUpdateRequest);
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
