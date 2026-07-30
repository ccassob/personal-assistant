using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace personal_assistant_api.Migrations
{
    /// <inheritdoc />
    public partial class AddTechnologyCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Technologies",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TechnologyCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyCategories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Technologies_CategoryId",
                table: "Technologies",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Technologies_TechnologyCategories_CategoryId",
                table: "Technologies",
                column: "CategoryId",
                principalTable: "TechnologyCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Technologies_TechnologyCategories_CategoryId",
                table: "Technologies");

            migrationBuilder.DropTable(
                name: "TechnologyCategories");

            migrationBuilder.DropIndex(
                name: "IX_Technologies_CategoryId",
                table: "Technologies");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Technologies");
        }
    }
}
