using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class TeamCreateRequest
    {
        [Required, MaxLength(50)]
        public required string Name { get; set; }
        public string ? Description { get; set; }

    }

}
