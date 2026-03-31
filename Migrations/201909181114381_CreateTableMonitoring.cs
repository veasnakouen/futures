namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableMonitoring : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Monitorings",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        MonitoringTime = c.String(),
                        Enroll = c.String(nullable: false, maxLength: 255),
                        Type = c.String(maxLength: 255),
                        ClientId = c.Int(nullable: false),
                        MonitoringDate = c.DateTime(nullable: false),
                        NextMonitoringDate = c.DateTime(nullable: false),
                        Monitoringtype = c.String(nullable: false, maxLength: 255),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Clients", t => t.ClientId)
                .Index(t => t.ClientId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Monitorings", "ClientId", "dbo.Clients");
            DropIndex("dbo.Monitorings", new[] { "ClientId" });
            DropTable("dbo.Monitorings");
        }
    }
}
