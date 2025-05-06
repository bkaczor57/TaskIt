using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class UserUpdateRequest
    {

        [MinLength(2), MaxLength(20)]
        public string ?FirstName { get; set; }
        [MinLength(2), MaxLength(20)]
        public string ?LastName { get; set; }
    }
}
