namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableSocialSupport : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SocialSupports",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CaseId = c.Int(nullable: false),
                        ClientId = c.Int(nullable: false),
                        SocialSupportNeeded = c.Boolean(nullable: false),
                        MeetingFuture = c.Boolean(nullable: false),
                        Problem = c.Boolean(nullable: false),
                        HealthProblembool = c.Boolean(nullable: false),
                        HealthProblem = c.String(maxLength: 255),
                        DrugProblembool = c.Boolean(nullable: false),
                        DrugProblem = c.String(maxLength: 255),
                        BabyProblembool = c.Boolean(nullable: false),
                        BabyProblem = c.String(maxLength: 255),
                        PersonalProblembool = c.Boolean(nullable: false),
                        PersonalProblem = c.String(maxLength: 255),
                        LegalProblembool = c.Boolean(nullable: false),
                        LegalProblem = c.String(maxLength: 255),
                        OtherProblembool = c.Boolean(nullable: false),
                        OtherProblem = c.String(maxLength: 510),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cases", t => t.CaseId)
                .ForeignKey("dbo.Clients", t => t.ClientId)
                .Index(t => t.CaseId)
                .Index(t => t.ClientId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SocialSupports", "ClientId", "dbo.Clients");
            DropForeignKey("dbo.SocialSupports", "CaseId", "dbo.Cases");
            DropIndex("dbo.SocialSupports", new[] { "ClientId" });
            DropIndex("dbo.SocialSupports", new[] { "CaseId" });
            DropTable("dbo.SocialSupports");
        }
    }
}
