namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateModalCvReference : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CvReferences",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 255),
                        Description = c.String(),
                        ClientId = c.Int(nullable: false),
                        JobPositionId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Clients", t => t.ClientId)
                .ForeignKey("dbo.JobPositions", t => t.JobPositionId)
                .Index(t => t.ClientId)
                .Index(t => t.JobPositionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CvReferences", "JobPositionId", "dbo.JobPositions");
            DropForeignKey("dbo.CvReferences", "ClientId", "dbo.Clients");
            DropIndex("dbo.CvReferences", new[] { "JobPositionId" });
            DropIndex("dbo.CvReferences", new[] { "ClientId" });
            DropTable("dbo.CvReferences");
        }
    }
}
