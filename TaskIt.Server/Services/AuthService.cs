using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;
using TaskIt.Server.Mappings;
using TaskIt.Server.Repository;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public class AuthService : IAuthService
    {
        //Adding Repository 
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }
        public async Task<ServiceResult<UserDTO>> Register(UserRegisterRequest request)
        {
            // Check if data already exists
            if (await _userRepository.GetUserByEmail(request.Email) != null)
            {
                return ServiceResult<UserDTO>.Fail("emailExist");
            }
            if (await _userRepository.GetUserByUsername(request.Username) != null)
            {
                return ServiceResult<UserDTO>.Fail("usernameExist");
            }

            // Parse Request To Entity
            var userEntity = UserMapper.ToUserEntity(request);
            // Save User to db
            _userRepository.AddUser(userEntity);
            await _userRepository.SaveChangesAsync();

            var userDTO = UserMapper.ToUserDTO(userEntity);
            return ServiceResult<UserDTO>.Ok(userDTO);
        }

        public async Task<ServiceResult<AuthResponseDTO>> Login(UserLoginRequest request)
        {
            var user = await _userRepository.GetUserByEmail(request.Email);
            if (user == null || !Utilis.PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
                return ServiceResult<AuthResponseDTO>.Fail("Niepoprawne dane logowania");

            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken(user);

            var userDTO = UserMapper.ToUserDTO(user);

            return ServiceResult<AuthResponseDTO>.Ok(new AuthResponseDTO
            {
                User = userDTO,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });

        }

        public async Task<ServiceResult<AuthResponseDTO>> RefreshToken(RefreshTokenRequest request)
        {
            var principal = GetPrincipalFromExpiredToken(request.AccessToken);
            if (principal == null)
                return ServiceResult<AuthResponseDTO>.Fail("Niepoprawny token");
            var email = principal.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return ServiceResult<AuthResponseDTO>.Fail("Brak e-maila.");

            var user = await _userRepository.GetUserByEmail(email);
            if (user == null)
                return ServiceResult<AuthResponseDTO>.Fail("Nie znaleziono użytkownika.");

            var newAccessToken = GenerateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken(user);

            var response = new AuthResponseDTO
            {
                User = UserMapper.ToUserDTO(user),
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };

            return ServiceResult<AuthResponseDTO>.Ok(response);
        }

        private string GenerateAccessToken(Users user)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds,
                claims: claims
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken(Users user)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim("tokenType", "refresh")
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds,
                claims: claims
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = false // Tu juz nie waliduje czasu tokena!
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

                if (securityToken is not JwtSecurityToken jwtToken ||
                    !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    return null;

                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
