namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableSocialSupportProblem : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SocialSupportProblems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SocialSupportCaseId = c.Int(nullable: false),
                        HealthProblembool = c.Boolean(nullable: false),
                        DrugProblembool = c.Boolean(nullable: false),
                        BabyProblembool = c.Boolean(nullable: false),
                        PersonalProblembool = c.Boolean(nullable: false),
                        LegalProblembool = c.Boolean(nullable: false),
                        OtherProblembool = c.Boolean(nullable: false),
                        Note = c.String(maxLength: 510),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SocialsupportCases", t => t.SocialSupportCaseId)
                .Index(t => t.SocialSupportCaseId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SocialSupportProblems", "SocialSupportCaseId", "dbo.SocialsupportCases");
            DropIndex("dbo.SocialSupportProblems", new[] { "SocialSupportCaseId" });
            DropTable("dbo.SocialSupportProblems");
        }
    }
}
