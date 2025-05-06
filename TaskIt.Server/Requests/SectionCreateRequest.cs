using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class SectionCreateRequest
    {
        [MaxLength(20)]
        public required string Title { get; set; }
        
    }
}
