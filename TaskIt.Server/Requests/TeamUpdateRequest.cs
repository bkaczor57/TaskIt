using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class TeamUpdateRequest
    {
        [MaxLength(50)]
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
