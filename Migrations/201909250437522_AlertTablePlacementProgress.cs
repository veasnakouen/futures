namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlertTablePlacementProgress : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PlacementProgresses", "Completed", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.PlacementProgresses", "Completed");
        }
    }
}
