using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskIt.Server.Migrations
{
    /// <inheritdoc />
    public partial class NewDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Notifications_OnlyOneReference",
                table: "Notifications");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Notifications_OnlyOneReference",
                table: "Notifications",
                sql: "\r\n                    (\"TaskId\" IS NOT NULL AND \"CommentId\" IS NULL AND \"TeamId\" IS NULL) OR\r\n                    (\"TaskId\" IS NULL AND \"CommentId\" IS NOT NULL AND \"TeamId\" IS NULL) OR\r\n                    (\"TaskId\" IS NULL AND \"CommentId\" IS NULL AND \"TeamId\" IS NOT NULL)\r\n                    ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Notifications_OnlyOneReference",
                table: "Notifications");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Notifications_OnlyOneReference",
                table: "Notifications",
                sql: "\r\n            (\"TaskId\" IS NOT NULL AND \"CommentId\" IS NULL AND \"TeamId\" IS NULL) OR\r\n            (\"TaskId\" IS NULL AND \"CommentId\" IS NOT NULL AND \"TeamId\" IS NULL) OR\r\n            (\"TaskId\" IS NULL AND \"CommentId\" IS NULL AND \"TeamId\" IS NOT NULL)\r\n        ");
        }
    }
}
