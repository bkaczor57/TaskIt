using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;
using TaskIt.Server.Services;

namespace TaskIt.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var result = await _userService.GetUserById(userId);

            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateRequest updateRequest)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var result = await _userService.UpdateUser(userId, updateRequest);

            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var result = await _userService.DeleteUser(userId);

            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });

            return NoContent();
        }


        //Admin Only
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var result = await _userService.GetUserById(id);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUser(id);
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return NoContent();
        }
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("list")]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _userService.GetUsers();
            if (!result.Success)
                return NotFound(new { error = result.ErrorMessage });
            return Ok(result.Data);
        }



    }
}
