namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableBusinessInProgress : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BusinessInProgresses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        MonitoringId = c.Int(nullable: false),
                        StillInbusiness = c.Int(nullable: false),
                        BusinessType = c.String(nullable: false, maxLength: 50),
                        Expense = c.String(nullable: false, maxLength: 50),
                        Income = c.String(nullable: false, maxLength: 50),
                        Note = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Monitorings", t => t.MonitoringId)
                .Index(t => t.MonitoringId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BusinessInProgresses", "MonitoringId", "dbo.Monitorings");
            DropIndex("dbo.BusinessInProgresses", new[] { "MonitoringId" });
            DropTable("dbo.BusinessInProgresses");
        }
    }
}
