using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Core.Enums;
using TaskIt.Server.Requests;
using TaskIt.Server.Services;

namespace TaskIt.Server.Controllers
{
    [Authorize]
    [Route("api")]
    [ApiController]
    public class TaskController : ControllerBase
    {

        private readonly ITaskService _taskService;
        private readonly IServiceHelper _serviceHelper;
        public TaskController(ITaskService taskService, IServiceHelper serviceHelper)
        {
            _taskService = taskService;
            _serviceHelper = serviceHelper;
        }

        /// <summary>
        /// Get all tasks - Admin only
        /// </summary>
        /// <returns></returns>
        ///
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("Tasks")]
        public IActionResult GetTasks()
        {
            // This is a placeholder for the actual implementation
            return Ok(new { message = "List of tasks" });
        }


        /// <summary>
        /// Get one task by TaskID 
        /// </summary>
        /// <param name="taskId"></param>
        /// <returns></returns>
        [HttpGet("Task/{taskId}")]
        public async Task<IActionResult> GetTaskById(int taskId)
        {
            var result = await _taskService.GetTaskByIdAsync(taskId, true);
            if (!result.Success || result.Data==null)
                return NotFound(new { error = result.ErrorMessage });

            var task = result.Data;
            
            if(!await _serviceHelper.CanPerformAction(GetUserId(), task.TeamId ?? 0, task.AssignedUserId, UserTeamRole.Member))
                return Unauthorized(new { error = "You are not a member of this team" });


            return Ok(result.Data);
        }
        /// <summary>
        ///     Get tasks by TeamID, FIltered by query
        /// </summary>
        /// <param name="teamId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("Team/{teamId}/task")]
        public async Task<IActionResult> GetTasksByTeamId(int teamId, [FromQuery] TasksQueryRequest request)
        {
           if(!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Member))
                return Unauthorized(new { error = "You are not a member of this team" });

            request.TeamId = teamId;

            var result = await _taskService.GetTasksFilteredAsync(request);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        /// <summary>
        ///       Get tasks by TeamID and SectionID, FIltered by query
        /// </summary>
        /// <param name="teamId"></param>
        /// <param name="sectionId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("Team/{teamId}/section/{sectionId}/task")]
        public async Task<IActionResult> GetTasksBySectionId(int teamId, int sectionId, [FromQuery] TasksQueryRequest request)
        {
            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, UserTeamRole.Member))
                return Unauthorized(new { error = "You are not a member of this team" });

            request.TeamId = teamId;
            request.SectionId = sectionId;

            var result = await _taskService.GetTasksFilteredAsync(request);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        /// <summary>
        ///     Get User Tasks 
        /// </summary>
        [HttpGet("Task/user")]
        public async Task<IActionResult> GetUserTasks([FromQuery] TasksUserQueryRequest request)
        {
           
            var result = await _taskService.GetUserTasksWithSearchAsync(GetUserId(), request);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpPost("Team/{teamId}/section/{sectionId}/task")]
        public async Task<IActionResult> CreateTask(int teamId, int sectionId, [FromBody] TaskCreateRequest request)
        {

            if(request.AssignedUserId == null)
            {
                request.AssignedUserId = GetUserId();
            }

            if (!await _serviceHelper.CanPerformAction(GetUserId(), teamId, request.AssignedUserId ?? GetUserId(), UserTeamRole.Manager))
                return Unauthorized(new { error = "You don't have permission to Create Task in this team" });

            var result = await _taskService.CreateTaskAsync(teamId, sectionId ,request);

            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpPut("Task/{taskId}")]
        public async Task<IActionResult> UpdateTask(int taskId, [FromBody] TaskUpdateRequest request)
        {            
            var result = await _taskService.UpdateTaskAsync(taskId, GetUserId(), request);
            if(!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpDelete("Task/{taskId}")]
        public IActionResult DeleteTask(int taskId)
        {
            var result = _taskService.DeleteTaskAsync(taskId, GetUserId());
            if (!result.Result.Success)
                return BadRequest(new { error = result.Result.ErrorMessage });

            return Ok(result);
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        }


    }
}
