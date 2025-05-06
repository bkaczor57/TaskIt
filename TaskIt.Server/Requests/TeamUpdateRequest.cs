using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class TeamUpdateRequest
    {
        [MaxLength(20)]
        public string? Name { get; set; }

        [MaxLength(300)]
        public string? Description { get; set; }
    }
}
