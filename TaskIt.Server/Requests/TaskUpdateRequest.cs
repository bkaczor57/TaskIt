using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TaskUpdateRequest
    {
        public int? AssignedUserId { get; set; }
        public int? SectionId { get; set; }
        [MaxLength(20)]
        public string? Title { get; set; }
        [MaxLength(300)]
        public string? Description { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TasksStatus? Status { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TasksPriority? Priority { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
