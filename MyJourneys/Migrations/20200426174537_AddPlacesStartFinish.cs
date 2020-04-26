using Microsoft.EntityFrameworkCore.Migrations;

namespace MyJourneys.Migrations
{
    public partial class AddPlacesStartFinish : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Finish",
                table: "Places",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Start",
                table: "Places",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Finish",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Start",
                table: "Places");
        }
    }
}
