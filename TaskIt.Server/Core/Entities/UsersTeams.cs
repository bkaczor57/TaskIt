using System.ComponentModel.DataAnnotations;
using TaskIt.Server.Core.Enums;
namespace TaskIt.Server.Core.Entities
{
    public class UsersTeams
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key
        public int UserId { get; set; }
        public Users? User { get; set; }


        // Foreign Key
        public int TeamId { get; set; }
        public Teams? Team { get; set; }

        public UserTeamRole Role { get; set; } = UserTeamRole.Member;

    }
}
