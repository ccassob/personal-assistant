using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace budget_api.Migrations
{
    /// <inheritdoc />
    public partial class AddCreditCardCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CreditCardTransactions_Categories_CategoryId",
                table: "CreditCardTransactions");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "CreditCardTransactions",
                newName: "CreditCardCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_CreditCardTransactions_CategoryId",
                table: "CreditCardTransactions",
                newName: "IX_CreditCardTransactions_CreditCardCategoryId");

            migrationBuilder.CreateTable(
                name: "CreditCardCategories",
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
                    table.PrimaryKey("PK_CreditCardCategories", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_CreditCardTransactions_CreditCardCategories_CreditCardCategoryId",
                table: "CreditCardTransactions",
                column: "CreditCardCategoryId",
                principalTable: "CreditCardCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CreditCardTransactions_CreditCardCategories_CreditCardCategoryId",
                table: "CreditCardTransactions");

            migrationBuilder.DropTable(
                name: "CreditCardCategories");

            migrationBuilder.RenameColumn(
                name: "CreditCardCategoryId",
                table: "CreditCardTransactions",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_CreditCardTransactions_CreditCardCategoryId",
                table: "CreditCardTransactions",
                newName: "IX_CreditCardTransactions_CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_CreditCardTransactions_Categories_CategoryId",
                table: "CreditCardTransactions",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
