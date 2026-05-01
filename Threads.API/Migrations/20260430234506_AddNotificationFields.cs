using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Threads.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RefId",
                table: "Notifications",
                newName: "PostId");

            migrationBuilder.AddColumn<Guid>(
                name: "RepostUserId",
                table: "Posts",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FromUserId",
                table: "Notifications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RepostUserId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "FromUserId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Message",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "Notifications",
                newName: "RefId");
        }
    }
}
