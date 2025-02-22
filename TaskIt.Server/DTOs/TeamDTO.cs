namespace TaskIt.Server.DTOs
{
    public class TeamDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; } // Właściciel zespołu
    }

}
