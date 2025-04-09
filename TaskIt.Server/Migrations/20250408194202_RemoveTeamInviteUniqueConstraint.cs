using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskIt.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTeamInviteUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TeamInvites_InvitedUserId_TeamId",
                table: "TeamInvites");

            migrationBuilder.CreateIndex(
                name: "IX_TeamInvites_InvitedUserId",
                table: "TeamInvites",
                column: "InvitedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamInvites_TeamId",
                table: "TeamInvites",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamInvites_Teams_TeamId",
                table: "TeamInvites",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamInvites_Teams_TeamId",
                table: "TeamInvites");

            migrationBuilder.DropIndex(
                name: "IX_TeamInvites_InvitedUserId",
                table: "TeamInvites");

            migrationBuilder.DropIndex(
                name: "IX_TeamInvites_TeamId",
                table: "TeamInvites");

            migrationBuilder.CreateIndex(
                name: "IX_TeamInvites_InvitedUserId_TeamId",
                table: "TeamInvites",
                columns: new[] { "InvitedUserId", "TeamId" },
                unique: true);
        }
    }
}
