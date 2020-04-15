using Microsoft.EntityFrameworkCore.Migrations;

namespace MyJourneys.Migrations
{
    public partial class AddCountries : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    Alpha2 = table.Column<string>(nullable: true),
                    Alpha3 = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OverviewJourneysCountries",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OverviewJourneyId = table.Column<int>(nullable: false),
                    CountryId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OverviewJourneysCountries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OverviewJourneysCountries_Countries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Countries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OverviewJourneysCountries_OverviewJourneys_OverviewJourneyId",
                        column: x => x.OverviewJourneyId,
                        principalTable: "OverviewJourneys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OverviewJourneysCountries_CountryId",
                table: "OverviewJourneysCountries",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_OverviewJourneysCountries_OverviewJourneyId",
                table: "OverviewJourneysCountries",
                column: "OverviewJourneyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OverviewJourneysCountries");

            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
