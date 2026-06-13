using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace budget_api.Migrations
{
    /// <inheritdoc />
    public partial class AddVehiclesFuelAndCleanup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "VehicleMaintenances");

            migrationBuilder.DropColumn(
                name: "Mechanic",
                table: "VehicleMaintenances");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "VehicleReminders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "VehicleFuels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    PricePerGallon = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Gallons = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleFuels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VehicleFuels_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VehicleMileageHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Mileage = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleMileageHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VehicleMileageHistories_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VehicleFuels_VehicleId",
                table: "VehicleFuels",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleMileageHistories_VehicleId",
                table: "VehicleMileageHistories",
                column: "VehicleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VehicleFuels");

            migrationBuilder.DropTable(
                name: "VehicleMileageHistories");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "VehicleReminders");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "VehicleMaintenances",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Mechanic",
                table: "VehicleMaintenances",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
