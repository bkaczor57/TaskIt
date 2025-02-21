using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class UserPasswordRequest
    {
        [Required]
        public required string OldPassword { get; set; }
        [Required,MinLength(8)]
        public required string NewPassword { get; set; }

    }
}
