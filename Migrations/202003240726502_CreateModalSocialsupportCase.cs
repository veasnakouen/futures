namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateModalSocialsupportCase : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SocialsupportCases",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        HaveCaseManager = c.String(nullable: false, maxLength: 10),
                        CaseWorkerId = c.Int(nullable: false),
                        OpenDate = c.DateTime(),
                        CloseDate = c.DateTime(),
                        HaveProblem = c.String(nullable: false, maxLength: 10),
                        ClientId = c.Int(nullable: false),
                        AccessBy = c.String(),
                        AccessDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CaseWorkers", t => t.CaseWorkerId)
                .ForeignKey("dbo.Clients", t => t.ClientId)
                .Index(t => t.CaseWorkerId)
                .Index(t => t.ClientId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SocialsupportCases", "ClientId", "dbo.Clients");
            DropForeignKey("dbo.SocialsupportCases", "CaseWorkerId", "dbo.CaseWorkers");
            DropIndex("dbo.SocialsupportCases", new[] { "ClientId" });
            DropIndex("dbo.SocialsupportCases", new[] { "CaseWorkerId" });
            DropTable("dbo.SocialsupportCases");
        }
    }
}
