using AutoMapper;
using TaskIt.Server.Core.Entities;

namespace TaskIt.Server.Mappings
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<Core.Entities.Users, DTOs.UserDTO>();
            CreateMap<DTOs.UserRegisterDTO, Core.Entities.Users>();
            CreateMap<DTOs.UserUpdateDTO, Core.Entities.Users>();
            CreateMap<DTOs.UserLoginDTO, Core.Entities.Users>();
        }
    }
}
