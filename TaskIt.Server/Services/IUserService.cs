using TaskIt.Server.Core.Enums;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface IUserService
    {
        Task<ServiceResult<UserDTO>> GetUserById(int userId);
        Task<ServiceResult<UserDTO>> GetUserByEmail(string email);
        Task<ServiceResult<UserDTO>> GetUserByUsername(string username);
        Task<ServiceResult<UserRole>> GetUserRole(int userId);
        Task<ServiceResult<List<UserDTO>>> GetUsers();

        Task<ServiceResult<UserDTO>> UpdateUser(int userId, UserUpdateRequest updateRequest);
        Task<ServiceResult<bool>> DeleteUser(int userId);
        Task GetUserById(int? assignedUserId);
    }
}
