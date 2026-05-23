using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace budget_api.Migrations
{
    /// <inheritdoc />
    public partial class AddDateTagColors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FutureColor",
                table: "AppSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PastColor",
                table: "AppSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TodayColor",
                table: "AppSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FutureColor",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "PastColor",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "TodayColor",
                table: "AppSettings");
        }
    }
}
