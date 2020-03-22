using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyJourneys.Migrations
{
    public partial class AddEventAndReservationItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HotelItems");

            migrationBuilder.CreateTable(
                name: "CommonJourneyItem",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    JourneyId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommonJourneyItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommonJourneyItem_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommonJourneyItem_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CommonJourneyItem_JourneyId",
                table: "CommonJourneyItem",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_CommonJourneyItem_UserId",
                table: "CommonJourneyItem",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CommonJourneyItem");

            migrationBuilder.CreateTable(
                name: "HotelItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    JourneyId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotelItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HotelItems_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HotelItems_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HotelItems_JourneyId",
                table: "HotelItems",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelItems_UserId",
                table: "HotelItems",
                column: "UserId");
        }
    }
}
