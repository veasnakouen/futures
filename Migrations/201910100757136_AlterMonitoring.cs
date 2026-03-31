namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterMonitoring : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Monitorings", "MonitoringTime", c => c.String(nullable: false, maxLength: 50));
            AlterColumn("dbo.Monitorings", "Type", c => c.String(nullable: false, maxLength: 255));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Monitorings", "Type", c => c.String(maxLength: 255));
            AlterColumn("dbo.Monitorings", "MonitoringTime", c => c.String());
        }
    }
}
