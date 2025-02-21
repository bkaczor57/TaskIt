using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface IUserService
    {
        Task<ServiceResult<UserDTO>> GetUserById(int userId);
        Task<ServiceResult<UserDTO>> UpdateUser(int userId, UserUpdateRequest updateRequest);
        Task<ServiceResult<bool>> DeleteUser(int userId);
    }
}
