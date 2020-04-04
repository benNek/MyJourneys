using Microsoft.EntityFrameworkCore.Migrations;

namespace MyJourneys.Migrations
{
    public partial class AddArticleTags : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Journeys",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "ArticleTags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tag = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticleTags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BlogTags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BlogId = table.Column<int>(nullable: false),
                    TagId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlogTags_Blogs_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BlogTags_ArticleTags_TagId",
                        column: x => x.TagId,
                        principalTable: "ArticleTags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Journeys_UserId",
                table: "Journeys",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogTags_BlogId",
                table: "BlogTags",
                column: "BlogId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogTags_TagId",
                table: "BlogTags",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Journeys_AspNetUsers_UserId",
                table: "Journeys",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Journeys_AspNetUsers_UserId",
                table: "Journeys");

            migrationBuilder.DropTable(
                name: "BlogTags");

            migrationBuilder.DropTable(
                name: "ArticleTags");

            migrationBuilder.DropIndex(
                name: "IX_Journeys_UserId",
                table: "Journeys");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Journeys",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
