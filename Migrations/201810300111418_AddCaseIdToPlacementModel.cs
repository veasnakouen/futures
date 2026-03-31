namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCaseIdToPlacementModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Placements", "CaseId", c => c.Int(nullable: false));
            CreateIndex("dbo.Placements", "CaseId");
            AddForeignKey("dbo.Placements", "CaseId", "dbo.Cases", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Placements", "CaseId", "dbo.Cases");
            DropIndex("dbo.Placements", new[] { "CaseId" });
            DropColumn("dbo.Placements", "CaseId");
        }
    }
}
