namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterPlacementaddtime : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Placements", "CaseId", "dbo.Cases");
            DropIndex("dbo.Placements", new[] { "CaseId" });
            AddColumn("dbo.Placements", "CountedTime", c => c.String(nullable: false));
            DropColumn("dbo.Placements", "CaseId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Placements", "CaseId", c => c.Int(nullable: false));
            DropColumn("dbo.Placements", "CountedTime");
            CreateIndex("dbo.Placements", "CaseId");
            AddForeignKey("dbo.Placements", "CaseId", "dbo.Cases", "Id");
        }
    }
}
