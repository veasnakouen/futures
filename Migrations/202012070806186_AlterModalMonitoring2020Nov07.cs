namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalMonitoring2020Nov07 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Monitorings", "PlacementId", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Monitorings", "PlacementId");
        }
    }
}
