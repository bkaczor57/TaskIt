using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskIt.Server.DTOs;
using TaskIt.Server.Mappings;
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
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            if (request == null)
            {
                return BadRequest();
            }

            var result = await _authService.Register(request);

            if (!result.Success)
            {
                if (result.ErrorMessage == "emailExist")
                    return Conflict(new { error = "Ten e-mail jest już używany." }); // Kod 409 Conflict

                if (result.ErrorMessage == "usernameExist")
                    return Conflict(new { error = "Ta nazwa użytkownika jest już zajęta." }); // Kod 409 Conflict

                return BadRequest(new { error = result.ErrorMessage });
            }

            return Ok(result.Data);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            var result = await _authService.Login(request);
            if (!result.Success)
                return Unauthorized(new { error = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] UserPasswordRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var result = await _authService.ChangePassword(userId, request);

            if (!result.Success)
                return BadRequest(new { error = result.ErrorMessage });

            return Ok(new { message = "Hasło zostało zmienione." });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.RefreshToken))
                return BadRequest("Brak wymaganych danych.");

            var result = await _authService.RefreshToken(request);
            if(!result.Success)
                return Unauthorized(new { error = result.ErrorMessage });

            return Ok(result.Data); 
        }



        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // W stateless JWT logout usuwa tokeny na froncie, backend nie musi nic robić
            return Ok("Wylogowano poprawnie");
        }

    }




}
