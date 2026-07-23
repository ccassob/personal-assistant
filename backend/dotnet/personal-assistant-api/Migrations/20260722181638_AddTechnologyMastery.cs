using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace personal_assistant_api.Migrations
{
    /// <inheritdoc />
    public partial class AddTechnologyMastery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Technologies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Technologies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TechnologyPracticeSections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TechnologyId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyPracticeSections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnologyPracticeSections_Technologies_TechnologyId",
                        column: x => x.TechnologyId,
                        principalTable: "Technologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TechnologyTheorySections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TechnologyId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyTheorySections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnologyTheorySections_Technologies_TechnologyId",
                        column: x => x.TechnologyId,
                        principalTable: "Technologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TechnologyPracticeItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SectionId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    IsDone = table.Column<bool>(type: "bit", nullable: false),
                    CompletedAt = table.Column<DateOnly>(type: "date", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyPracticeItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnologyPracticeItems_TechnologyPracticeSections_SectionId",
                        column: x => x.SectionId,
                        principalTable: "TechnologyPracticeSections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TechnologyTheoryQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SectionId = table.Column<int>(type: "int", nullable: false),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    IsMastered = table.Column<bool>(type: "bit", nullable: false),
                    AnsweredAt = table.Column<DateOnly>(type: "date", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyTheoryQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnologyTheoryQuestions_TechnologyTheorySections_SectionId",
                        column: x => x.SectionId,
                        principalTable: "TechnologyTheorySections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TechnologyPracticeItems_SectionId",
                table: "TechnologyPracticeItems",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnologyPracticeSections_TechnologyId",
                table: "TechnologyPracticeSections",
                column: "TechnologyId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnologyTheoryQuestions_SectionId",
                table: "TechnologyTheoryQuestions",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnologyTheorySections_TechnologyId",
                table: "TechnologyTheorySections",
                column: "TechnologyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TechnologyPracticeItems");

            migrationBuilder.DropTable(
                name: "TechnologyTheoryQuestions");

            migrationBuilder.DropTable(
                name: "TechnologyPracticeSections");

            migrationBuilder.DropTable(
                name: "TechnologyTheorySections");

            migrationBuilder.DropTable(
                name: "Technologies");
        }
    }
}
