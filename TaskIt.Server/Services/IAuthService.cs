using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface IAuthService
    {
        Task<ServiceResult<UserDTO>> Register(UserRegisterRequest request);
        
        Task<ServiceResult<AuthResponseDTO>> Login(UserLoginRequest request);
    }
}
