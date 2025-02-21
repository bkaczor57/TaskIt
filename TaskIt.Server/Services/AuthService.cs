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
            var refreshToken = GenerateRefreshToken();

            var userDTO = UserMapper.ToUserDTO(user);

            return ServiceResult<AuthResponseDTO>.Ok(new AuthResponseDTO
            {
                User = userDTO,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });

        }

        private string GenerateAccessToken(Users user)
        {
            var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Name, user.Username)
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

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
