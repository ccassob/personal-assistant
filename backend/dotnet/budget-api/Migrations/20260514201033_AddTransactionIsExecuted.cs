using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace budget_api.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionIsExecuted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsExecuted",
                table: "Transactions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsExecuted",
                table: "Transactions");
        }
    }
}
