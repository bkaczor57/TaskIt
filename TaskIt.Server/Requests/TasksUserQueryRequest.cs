using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TasksUserQueryRequest
    {
        public int AssignedUserId { get; set; }
        public bool Ascending { get; set; } = true;

        // domyślne filtrowanie po dacie utworzenia
        public string? OrderBy { get; set; } = "createdat";

        // Opcjonalne filtrowanie po Statusie i Priorytecie
        public TasksStatus? Status { get; set; }
        public TasksPriority? Priority { get; set; }

        // Filtrowanie po wielu teamach - możliwe do wykorzystania w przypadku gdzie użytkownik zechce wyświetlić zadania z konkretnych teamów.
        public List<int>? TeamIds { get; set; }
        // Opcjonalne wyszukiwanie po konkretnym search termie
        public string? SearchTerm { get; set; }

        // Opcjonalna paginacja
        public int? PageNumber { get; set; } = 0;
        public int? PageSize { get; set; } = 0;
    }
}
