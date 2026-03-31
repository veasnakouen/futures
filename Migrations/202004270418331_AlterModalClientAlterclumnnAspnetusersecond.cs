namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalClientAlterclumnnAspnetusersecond : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Clients", name: "AspUser_Id", newName: "AspUserId");
            RenameIndex(table: "dbo.Clients", name: "IX_AspUser_Id", newName: "IX_AspUserId");
            DropColumn("dbo.Clients", "EnrollByUserId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Clients", "EnrollByUserId", c => c.String());
            RenameIndex(table: "dbo.Clients", name: "IX_AspUserId", newName: "IX_AspUser_Id");
            RenameColumn(table: "dbo.Clients", name: "AspUserId", newName: "AspUser_Id");
        }
    }
}
