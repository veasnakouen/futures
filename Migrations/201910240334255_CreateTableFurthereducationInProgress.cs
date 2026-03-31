namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableFurthereducationInProgress : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FurthereducationInProgresses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        MonitoringId = c.Int(nullable: false),
                        Ontraining = c.String(nullable: false, maxLength: 50),
                        GraduateDate = c.DateTime(),
                        DropoutDate = c.DateTime(),
                        Reason = c.String(nullable: false, maxLength: 250),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Monitorings", t => t.MonitoringId)
                .Index(t => t.MonitoringId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FurthereducationInProgresses", "MonitoringId", "dbo.Monitorings");
            DropIndex("dbo.FurthereducationInProgresses", new[] { "MonitoringId" });
            DropTable("dbo.FurthereducationInProgresses");
        }
    }
}
