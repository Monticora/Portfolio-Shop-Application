using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Context.Migrations
{
    /// <inheritdoc />
    public partial class ChangeIdToStringInsideProductItemOrdered : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "084ad98b-5f7d-403a-a598-b08667efd8bc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ad844d10-c094-4735-b472-05ff50a1bda5");

            migrationBuilder.AlterColumn<Guid>(
                name: "ItemOrdered_ProductId",
                table: "OrderItem",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5ce079e9-27c8-427c-8bda-eaee2dec0dc9", null, "Admin", "ADMIN" },
                    { "b6bd6298-8272-4a32-b308-21c4a45f200f", null, "Member", "MEMBER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5ce079e9-27c8-427c-8bda-eaee2dec0dc9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b6bd6298-8272-4a32-b308-21c4a45f200f");

            migrationBuilder.AlterColumn<int>(
                name: "ItemOrdered_ProductId",
                table: "OrderItem",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "084ad98b-5f7d-403a-a598-b08667efd8bc", null, "Admin", "ADMIN" },
                    { "ad844d10-c094-4735-b472-05ff50a1bda5", null, "Member", "MEMBER" }
                });
        }
    }
}
