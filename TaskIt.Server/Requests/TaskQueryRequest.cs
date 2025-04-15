using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TasksQueryRequest
    {
        public bool Ascending { get; set; } = true;

        // domyślne filtrowanie po dacie utworzenia
        public TaskOrderBy? OrderBy { get; set; } = TaskOrderBy.CreatedAt;
    
        public int? AssignedUserId { get; set; }
        public int? SectionId { get; set; }
        public int? TeamId { get; set; }

        public TasksStatus? Status { get; set; }
        public TasksPriority? Priority { get; set; }

        public DateTime? DueBefore { get; set; }
        public DateTime? DueAfter { get; set; }
        public DateTime? CreatedBefore { get; set; }
        public DateTime? CreatedAfter { get; set; }

        // Opcjonalne wyszukiwanie po tytule i opisie
        public string? SearchTerm { get; set; }

        // Opcjonalna paginacja:
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }

        // Czy dołączyć Team - W przypadku potrzeby pobrania TeamId i TeamName
        public bool IncludeTeam { get; set; } = false;
    }
}
