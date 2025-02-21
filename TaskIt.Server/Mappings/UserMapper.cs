using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;
using TaskIt.Server.Utilis;

namespace TaskIt.Server.Mappings
{
    public class UserMapper
    {
        public static Users ToUserEntity(UserRegisterRequest userRegisterRequest)
        {
            return new Users
            {
                Email = userRegisterRequest.Email,
                Username = userRegisterRequest.Username,
                PasswordHash = PasswordHasher.HashPassword(userRegisterRequest.Password),
                FirstName = userRegisterRequest.FirstName,
                LastName = userRegisterRequest.LastName
            };
        }

        public static UserDTO ToUserDTO(Users user)
        {
            return new UserDTO
            { 
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

    }
}
