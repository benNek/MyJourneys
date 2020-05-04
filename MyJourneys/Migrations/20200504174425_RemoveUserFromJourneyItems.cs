using Microsoft.EntityFrameworkCore.Migrations;

namespace MyJourneys.Migrations
{
    public partial class RemoveUserFromJourneyItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventItems_AspNetUsers_UserId",
                table: "EventItems");

            migrationBuilder.DropForeignKey(
                name: "FK_FlightItems_AspNetUsers_UserId",
                table: "FlightItems");

            migrationBuilder.DropForeignKey(
                name: "FK_HotelItems_AspNetUsers_UserId",
                table: "HotelItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Notes_AspNetUsers_UserId",
                table: "Notes");

            migrationBuilder.DropForeignKey(
                name: "FK_Places_AspNetUsers_UserId",
                table: "Places");

            migrationBuilder.DropForeignKey(
                name: "FK_ReservationItems_AspNetUsers_UserId",
                table: "ReservationItems");

            migrationBuilder.DropIndex(
                name: "IX_ReservationItems_UserId",
                table: "ReservationItems");

            migrationBuilder.DropIndex(
                name: "IX_Places_UserId",
                table: "Places");

            migrationBuilder.DropIndex(
                name: "IX_Notes_UserId",
                table: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_HotelItems_UserId",
                table: "HotelItems");

            migrationBuilder.DropIndex(
                name: "IX_FlightItems_UserId",
                table: "FlightItems");

            migrationBuilder.DropIndex(
                name: "IX_EventItems_UserId",
                table: "EventItems");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ReservationItems");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "HotelItems");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "FlightItems");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "EventItems");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "ReservationItems",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Places",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Notes",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "HotelItems",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "FlightItems",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "EventItems",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReservationItems_UserId",
                table: "ReservationItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Places_UserId",
                table: "Places",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_UserId",
                table: "Notes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelItems_UserId",
                table: "HotelItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FlightItems_UserId",
                table: "FlightItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EventItems_UserId",
                table: "EventItems",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventItems_AspNetUsers_UserId",
                table: "EventItems",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FlightItems_AspNetUsers_UserId",
                table: "FlightItems",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HotelItems_AspNetUsers_UserId",
                table: "HotelItems",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_AspNetUsers_UserId",
                table: "Notes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Places_AspNetUsers_UserId",
                table: "Places",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationItems_AspNetUsers_UserId",
                table: "ReservationItems",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
