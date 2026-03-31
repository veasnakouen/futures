namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddClientIdToPlacementModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Placements", "ClientId", c => c.Int(nullable: false));
            CreateIndex("dbo.Placements", "ClientId");
            AddForeignKey("dbo.Placements", "ClientId", "dbo.Clients", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Placements", "ClientId", "dbo.Clients");
            DropIndex("dbo.Placements", new[] { "ClientId" });
            DropColumn("dbo.Placements", "ClientId");
        }
    }
}
