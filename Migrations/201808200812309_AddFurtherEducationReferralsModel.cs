namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFurtherEducationReferralsModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FurtherEducationReferrals",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ReferralDate = c.DateTime(),
                        Subject = c.String(),
                        Provider = c.String(),
                        Duration = c.String(),
                        ReferralBy = c.String(),
                        EducationReferralSourceId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.EducationReferralSources", t => t.EducationReferralSourceId)
                .Index(t => t.EducationReferralSourceId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FurtherEducationReferrals", "EducationReferralSourceId", "dbo.EducationReferralSources");
            DropIndex("dbo.FurtherEducationReferrals", new[] { "EducationReferralSourceId" });
            DropTable("dbo.FurtherEducationReferrals");
        }
    }
}
