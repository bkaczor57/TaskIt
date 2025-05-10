using System.Text.Json.Serialization;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TaskCountRequest
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TasksStatus? Status { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TasksPriority? Priority { get; set; } 

    }
}
