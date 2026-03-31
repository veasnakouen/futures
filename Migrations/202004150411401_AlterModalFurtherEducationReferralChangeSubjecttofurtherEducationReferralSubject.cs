namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalFurtherEducationReferralChangeSubjecttofurtherEducationReferralSubject : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FurtherEducationReferrals", "furtherEducationReferralSubjectId", c => c.Int(nullable: false));
            CreateIndex("dbo.FurtherEducationReferrals", "furtherEducationReferralSubjectId");
            AddForeignKey("dbo.FurtherEducationReferrals", "furtherEducationReferralSubjectId", "dbo.furtherEducationReferralSubjects", "Id");
            DropColumn("dbo.FurtherEducationReferrals", "Subject");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FurtherEducationReferrals", "Subject", c => c.String());
            DropForeignKey("dbo.FurtherEducationReferrals", "furtherEducationReferralSubjectId", "dbo.furtherEducationReferralSubjects");
            DropIndex("dbo.FurtherEducationReferrals", new[] { "furtherEducationReferralSubjectId" });
            DropColumn("dbo.FurtherEducationReferrals", "furtherEducationReferralSubjectId");
        }
    }
}
