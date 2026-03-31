namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalClientAspnetuseridFixError : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Clients", "AspUserId", "dbo.AspNetUsers");
            DropIndex("dbo.Clients", new[] { "AspUserId" });
            AlterColumn("dbo.Clients", "AspUserId", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Clients", "AspUserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Clients", "AspUserId");
            AddForeignKey("dbo.Clients", "AspUserId", "dbo.AspNetUsers", "Id");
        }
    }
}
