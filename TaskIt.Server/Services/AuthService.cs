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
        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<ServiceResult<UserDTO>> Register(UserRegisterRequest request)
        {
            // Check if data already exists
            if (await _userRepository.GetUserByEmail(request.Email) != null)
            {
                return ServiceResult<UserDTO>.Fail("EmailAlreadyExists");
            }
            if (await _userRepository.GetUserByUsername(request.Username) != null)
            {
                return ServiceResult<UserDTO>.Fail("UsernameAlreadyExists");
            }

            // Parse Request To Entity
            var userEntity = UserMapper.ToUserEntity(request);
            // Save User to db
            _userRepository.AddUser(userEntity);
            await _userRepository.SaveChangesAsync();

            var userDTO = UserMapper.ToUserDTO(userEntity);
            return ServiceResult<UserDTO>.Ok(userDTO);
        }

        public async Task<ServiceResult<UserDTO>> Login(UserLoginRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
