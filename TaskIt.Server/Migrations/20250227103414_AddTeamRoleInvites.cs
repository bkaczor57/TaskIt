using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskIt.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamRoleInvites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TeamRole",
                table: "TeamInvites",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TeamRole",
                table: "TeamInvites");
        }
    }
}
