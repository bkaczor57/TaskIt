using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnumsController : ControllerBase
    {

        [HttpGet("userRoles")]
        public IActionResult GetUserRole()
        {
            var roles = Enum.GetNames(typeof(UserRole)).ToList();
            return Ok(roles);
        }

        [HttpGet("userTeamRoles")]
        public  IActionResult GetUserTeamRoles()
        {
            var roles = Enum.GetNames(typeof(UserTeamRole)).ToList();
            return Ok(roles);
        }

        [HttpGet("inviteStatus")]
        public IActionResult GetInviteStatus()
        {
            var statuses = Enum.GetNames(typeof(InviteStatus)).ToList();
            return Ok(statuses);
        }

        [HttpGet("taskStatus")]
        public IActionResult GetTaskStatus()
        {
            var statuses = Enum.GetNames(typeof(TasksStatus)).ToList();
            return Ok(statuses);
        }

        [HttpGet("taskPriority")]
        public IActionResult GetTaskPriority()
        {
            var priorities = Enum.GetNames(typeof(TasksPriority)).ToList();
            return Ok(priorities);
        }

        [HttpGet("notificationType")]
        public IActionResult GetNotificationType()
        {
            var types = Enum.GetNames(typeof(NotificationType)).ToList();
            return Ok(types);
        }

        [HttpGet("taskOrderBy")]
        public IActionResult GetTaskOrderBy()
        {
            var order = Enum.GetNames(typeof(TaskOrderBy)).ToList();
            return Ok(order);
        }
    }
}
