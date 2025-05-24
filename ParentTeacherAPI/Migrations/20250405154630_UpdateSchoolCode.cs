using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ParentTeacherAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchoolCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SchoolId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "SchoolCode",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SchoolCode",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "SchoolId",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: true);
        }
    }
}
