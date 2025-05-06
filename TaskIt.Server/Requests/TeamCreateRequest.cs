using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class TeamCreateRequest
    {
        [Required, MaxLength(20)]
        public required string Name { get; set; }

        [MaxLength(300)]
        public string ? Description { get; set; }

    }

}
