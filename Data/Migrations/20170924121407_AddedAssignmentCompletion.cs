using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Hiredjs.Data.Migrations
{
    public partial class AddedAssignmentCompletion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Verified",
                table: "Scripts");

            migrationBuilder.AddColumn<DateTime>(
                name: "VerifiedOn",
                table: "Scripts",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AssignmentCompletions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AssignmentId = table.Column<int>(type: "int", nullable: false),
                    CompletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserId = table.Column<string>(type: "varchar(127)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssignmentCompletions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssignmentCompletions_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AssignmentCompletions_UserId",
                table: "AssignmentCompletions",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssignmentCompletions");

            migrationBuilder.DropColumn(
                name: "VerifiedOn",
                table: "Scripts");

            migrationBuilder.AddColumn<DateTime>(
                name: "Verified",
                table: "Scripts",
                nullable: true);
        }
    }
}
