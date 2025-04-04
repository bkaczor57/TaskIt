using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.DTOs
{
    public class UserTeamDTO
    {
        
            public int Id { get; set; }
            public string Name { get; set; }
            public string? Description { get; set; }
            public int OwnerId { get; set; } // Właściciel zespołu
            public DateTime CreatedAt { get; set; } // Data utworzenia
            public string Role { get; set; }
    }
}
