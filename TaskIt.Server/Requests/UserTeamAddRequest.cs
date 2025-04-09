using System.Text.Json.Serialization;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class UserTeamAddRequest
    {
        public int UserId { get; set; }
        public int TeamId { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserTeamRole? Role { get; set; } // Opcjonalnie, domyślnie Member
    }
}
