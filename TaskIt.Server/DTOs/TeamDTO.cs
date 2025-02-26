namespace TaskIt.Server.DTOs
{
    public class TeamDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ?Description { get; set; }
        public int OwnerId { get; set; } // Właściciel zespołu
        public DateTime CreatedAt { get; set; } // Data utworzenia
    }

}
