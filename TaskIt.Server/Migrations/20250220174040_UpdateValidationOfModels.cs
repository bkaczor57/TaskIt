using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskIt.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateValidationOfModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CommentsId",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_CommentsId",
                table: "Notifications",
                column: "CommentsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Comments_CommentsId",
                table: "Notifications",
                column: "CommentsId",
                principalTable: "Comments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Comments_CommentsId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_CommentsId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "CommentsId",
                table: "Notifications");
        }
    }
}
