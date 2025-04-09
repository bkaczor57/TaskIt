using System.Text.Json.Serialization;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class UserTeamUpdateRequest
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserTeamRole? Role { get; set; } // Opcjonalnie, domyślnie Member
    }
}
