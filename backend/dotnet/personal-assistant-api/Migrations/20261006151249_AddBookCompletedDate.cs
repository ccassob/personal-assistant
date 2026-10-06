using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalAssistant.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBookCompletedDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "CompletedDate",
                table: "Books",
                type: "date",
                nullable: true);

            migrationBuilder.Sql("UPDATE Books SET CompletedDate = LastUpdated WHERE Status = 'Completed'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedDate",
                table: "Books");
        }
    }
}
