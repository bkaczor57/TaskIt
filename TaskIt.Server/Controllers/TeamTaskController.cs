using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.Services;

namespace TaskIt.Server.Controllers
{
    [Authorize]
    [Route("api/Team/{teamId}/sections/{sectionId}/tasks")]
    [ApiController]
    public class TeamTaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly IServiceHelper _serviceHelper;

        public TeamTaskController(ITaskService taskService, IServiceHelper serviceHelper)
        {
            _taskService = taskService;
            _serviceHelper = serviceHelper;
        }

        //[HttpGet]
        //public async Task<IActionResult> GetSectionTasks(int teamId, int sectionId)
        //{
        //    if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Member))
        //        return Unauthorized(new { error = "You don't have permission to do this action" });
        //    //var result = await _taskService.GetTasksBySectionId(sectionId);
        //    //if (!result.Success)
        //    //    return NotFound(new { error = result.ErrorMessage });
        //    //return Ok(result.Data);
        //    return Ok();

        //}


        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
    }
}
