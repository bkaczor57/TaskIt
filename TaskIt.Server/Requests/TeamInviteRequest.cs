using System.Text.Json.Serialization;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TeamInviteRequest
    {
        public int TeamId { get; set; }
        public required string InvitedUserEmail { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserTeamRole? TeamRole { get; set; }

    }
}
