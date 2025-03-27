namespace TaskIt.Server.DTOs
{
    public class SectionDTO
    {
        public int SectionId { get; set; }
        public required string Title { get; set; }
        public int TeamId { get; set; }
    }
}
