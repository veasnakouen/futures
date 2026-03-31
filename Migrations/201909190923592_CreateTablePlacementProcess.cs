namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTablePlacementProcess : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PlacementProgresses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        MonitoringId = c.Int(nullable: false),
                        PlacementStatus = c.String(nullable: false),
                        Salary = c.String(nullable: false),
                        Note = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Monitorings", t => t.MonitoringId)
                .Index(t => t.MonitoringId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PlacementProgresses", "MonitoringId", "dbo.Monitorings");
            DropIndex("dbo.PlacementProgresses", new[] { "MonitoringId" });
            DropTable("dbo.PlacementProgresses");
        }
    }
}
