using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TaskIt.Server.Requests;
using TaskIt.Server.Services;

namespace TaskIt.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Adding Service
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult>Register(UserRegisterRequest request)
        {
            if (request == null) {
                return BadRequest();
            }

            var result = await _authService.Register(request);
            
            if(!result.Success)
            {
                if (result.ErrorMessage == "EmailAlreadyExists")
                    return Conflict(new { error = "Ten e-mail jest już używany." }); // Kod 409 Conflict

                if (result.ErrorMessage == "UsernameAlreadyExists")
                    return Conflict(new { error = "Ta nazwa użytkownika jest już zajęta." }); // Kod 409 Conflict

                return BadRequest(new { error = result.ErrorMessage });
            }

            return Ok(result.Data);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            return Ok();
        }
    }
}
