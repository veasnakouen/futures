namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateFutureTrainingProgress : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FutureTrainingProgresses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        MonitoringId = c.Int(nullable: false),
                        LessionId = c.Int(nullable: false),
                        Ontraining = c.String(nullable: false, maxLength: 50),
                        GraduateDate = c.DateTime(nullable: false),
                        DropoutDate = c.DateTime(),
                        Reason = c.String(nullable: false, maxLength: 250),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Lessions", t => t.LessionId)
                .ForeignKey("dbo.Monitorings", t => t.MonitoringId)
                .Index(t => t.MonitoringId)
                .Index(t => t.LessionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FutureTrainingProgresses", "MonitoringId", "dbo.Monitorings");
            DropForeignKey("dbo.FutureTrainingProgresses", "LessionId", "dbo.Lessions");
            DropIndex("dbo.FutureTrainingProgresses", new[] { "LessionId" });
            DropIndex("dbo.FutureTrainingProgresses", new[] { "MonitoringId" });
            DropTable("dbo.FutureTrainingProgresses");
        }
    }
}
