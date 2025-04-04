namespace TaskIt.Server.DTOs
{
    public class TeamInviteDTO
    {
        public int Id { get; set; }
        public TeamInviteTeamDTO? Team { get; set; }
        public TeamInviteUserDTO? InvitedUser { get; set; }
        public TeamInviteUserDTO? InvitingUser { get; set; }
        public string? TeamRole { get; set; } = "Member";
        public string? Status { get; set; } = "Pending";
        public DateTime InviteDate { get; set; } = DateTime.UtcNow;
        public DateTime? ResponseDate { get; set; }
    }
}
