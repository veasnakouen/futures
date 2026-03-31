namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalPlacementadddropfromjobdate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Placements", "DropfromDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Placements", "DropfromDate");
        }
    }
}
