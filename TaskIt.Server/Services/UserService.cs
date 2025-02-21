using TaskIt.Server.DTOs;
using TaskIt.Server.Mappings;
using TaskIt.Server.Repository;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ServiceResult<UserDTO>> GetUserById(int userId)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
                return ServiceResult<UserDTO>.Fail("User not found");

            return ServiceResult<UserDTO>.Ok(UserMapper.ToUserDTO(user));
        }

        public async Task<ServiceResult<UserDTO>> UpdateUser(int userId, UserUpdateRequest updateRequest)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
                return ServiceResult<UserDTO>.Fail("User not found");

            if(updateRequest.FirstName!=null)
                user.FirstName = updateRequest.FirstName;
            if(updateRequest.LastName != null)
                user.LastName = updateRequest.LastName;

            _userRepository.UpdateUser(user);
            await _userRepository.SaveChangesAsync();

            return ServiceResult<UserDTO>.Ok(UserMapper.ToUserDTO(user));
        }

        public async Task<ServiceResult<bool>> DeleteUser(int userId)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
                return ServiceResult<bool>.Fail("User not found");

            _userRepository.DeleteUser(user);
            await _userRepository.SaveChangesAsync();

            return ServiceResult<bool>.Ok(true);
        }
    }

}
