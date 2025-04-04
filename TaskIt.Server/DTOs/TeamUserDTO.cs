using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.DTOs
{
    public class TeamUserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
    }

}
