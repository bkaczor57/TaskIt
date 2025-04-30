using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json.Serialization;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TasksUserQueryRequest
    {
        public bool Ascending { get; set; } = true;

        // domyślne filtrowanie po dacie utworzenia
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TaskOrderBy? OrderBy { get; set; } = TaskOrderBy.CreatedAt;

        // Opcjonalne filtrowanie po Statusie i Priorytecie
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TasksStatus? Status { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TasksPriority? Priority { get; set; }

        // Filtrowanie po wielu teamach - możliwe do wykorzystania w przypadku gdzie użytkownik zechce wyświetlić zadania z konkretnych teamów.
        public List<int>? TeamIds { get; set; }
        // Opcjonalne wyszukiwanie po konkretnym search termie
        public string? SearchTerm { get; set; }

        // Opcjonalna paginacja
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
    }
}
