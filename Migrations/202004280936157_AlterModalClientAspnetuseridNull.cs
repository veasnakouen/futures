namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalClientAspnetuseridNull : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Clients", new[] { "AspUserId" });
            AlterColumn("dbo.Clients", "AspUserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Clients", "AspUserId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Clients", new[] { "AspUserId" });
            AlterColumn("dbo.Clients", "AspUserId", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.Clients", "AspUserId");
        }
    }
}
