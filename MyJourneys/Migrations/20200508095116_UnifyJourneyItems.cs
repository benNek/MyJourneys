using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyJourneys.Migrations
{
    public partial class UnifyJourneyItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventItems");

            migrationBuilder.DropTable(
                name: "FlightItems");

            migrationBuilder.DropTable(
                name: "HotelItems");

            migrationBuilder.DropTable(
                name: "ReservationItems");

            migrationBuilder.CreateTable(
                name: "JourneyItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(nullable: false),
                    JourneyId = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    Airline = table.Column<string>(nullable: true),
                    FlightNumber = table.Column<string>(nullable: true),
                    Origin = table.Column<string>(nullable: true),
                    Destination = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JourneyItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JourneyItems_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JourneyItems_JourneyId",
                table: "JourneyItems",
                column: "JourneyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JourneyItems");

            migrationBuilder.CreateTable(
                name: "EventItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    JourneyId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventItems_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FlightItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Airline = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FlightNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JourneyId = table.Column<int>(type: "int", nullable: false),
                    Origin = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlightItems_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HotelItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    JourneyId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                });

            migrationBuilder.CreateTable(
                name: "ReservationItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    JourneyId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservationItems_Journeys_JourneyId",
                        column: x => x.JourneyId,
                        principalTable: "Journeys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventItems_JourneyId",
                table: "EventItems",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_FlightItems_JourneyId",
                table: "FlightItems",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_HotelItems_JourneyId",
                table: "HotelItems",
                column: "JourneyId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationItems_JourneyId",
                table: "ReservationItems",
                column: "JourneyId");
        }
    }
}
