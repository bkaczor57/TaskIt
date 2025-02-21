using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class UserLoginRequest
    {
        [Required,EmailAddress]
        public string Email { get; set; }
        [Required,MinLength(8)]
        public string Password { get; set; }
    }
}
