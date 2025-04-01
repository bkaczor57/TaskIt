using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.DTOs
{
    public class AuthResponseDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
