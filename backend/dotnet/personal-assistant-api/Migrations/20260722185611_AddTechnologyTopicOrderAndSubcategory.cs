using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace personal_assistant_api.Migrations
{
    /// <inheritdoc />
    public partial class AddTechnologyTopicOrderAndSubcategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "TechnologyTheoryQuestions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Subcategory",
                table: "TechnologyTheoryQuestions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "TechnologyPracticeItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Subcategory",
                table: "TechnologyPracticeItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "TechnologyTheoryQuestions");

            migrationBuilder.DropColumn(
                name: "Subcategory",
                table: "TechnologyTheoryQuestions");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "TechnologyPracticeItems");

            migrationBuilder.DropColumn(
                name: "Subcategory",
                table: "TechnologyPracticeItems");
        }
    }
}
