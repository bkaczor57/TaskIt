using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
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
        private readonly string _jwtKey;
        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _jwtKey = _configuration["Jwt:Key"];

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

            return ServiceResult<AuthResponseDTO>.Ok(new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
            });
        }

        public async Task<ServiceResult<bool>> ChangePassword(int userId, UserPasswordRequest request)
        {
            // Pobierz użytkownika z bazy
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
            {
                return ServiceResult<bool>.Fail("Użytkownik nie istnieje.");
            }

            // Zweryfikuj stare hasło
            var isValid = Utilis.PasswordHasher.VerifyPassword(request.OldPassword, user.PasswordHash);
            if (!isValid)
            {
                return ServiceResult<bool>.Fail("Niepoprawne aktualne hasło.");
            }

            // Zhashuj nowe hasło
            var newHashedPassword = Utilis.PasswordHasher.HashPassword(request.NewPassword);
            user.PasswordHash = newHashedPassword;

            // Zaktualizuj użytkownika
            _userRepository.UpdateUser(user);
            await _userRepository.SaveChangesAsync();

            return ServiceResult<bool>.Ok(true);

        }

        public async Task<ServiceResult<AuthResponseDTO>> RefreshToken(RefreshTokenRequest request)
        {
            var principal = GetPrincipalFromRefreshToken(request.RefreshToken);
            if (principal == null)
                return ServiceResult<AuthResponseDTO>.Fail("Niepoprawny lub wygasły refresh Token");

            if(principal.FindFirst("tokenType")?.Value != "refresh")
                return ServiceResult<AuthResponseDTO>.Fail("Niepoprawny token");

            var id = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(id))
                return ServiceResult<AuthResponseDTO>.Fail("brak id.");

            var user = await _userRepository.GetUserById(Int32.Parse(id));
            if (user == null)
                return ServiceResult<AuthResponseDTO>.Fail("Nie znaleziono użytkownika.");

            var newAccessToken = GenerateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken(user);

            var response = new AuthResponseDTO
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
            };

            return ServiceResult<AuthResponseDTO>.Ok(response);
        }

        private string GenerateAccessToken(Users user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub,user.Id.ToString()),
                new Claim("UserRole", user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds,
                claims: claims

            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken(Users user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub,user.Id.ToString()),
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


        private ClaimsPrincipal? GetPrincipalFromRefreshToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = true, 
                ClockSkew = TimeSpan.Zero
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
