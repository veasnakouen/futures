namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalClientAlterclumnnAspnetuser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "EnrollByUserId", c => c.String());
            AddColumn("dbo.Clients", "AspUser_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.Clients", "AspUser_Id");
            AddForeignKey("dbo.Clients", "AspUser_Id", "dbo.AspNetUsers", "Id");
            DropColumn("dbo.Clients", "EnrollBy");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Clients", "EnrollBy", c => c.String(maxLength: 255));
            DropForeignKey("dbo.Clients", "AspUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Clients", new[] { "AspUser_Id" });
            DropColumn("dbo.Clients", "AspUser_Id");
            DropColumn("dbo.Clients", "EnrollByUserId");
        }
    }
}
