namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalfurtherEducationReferralSubjectAddmorelength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.furtherEducationReferralSubjects", "Subject", c => c.String(nullable: false, maxLength: 255));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.furtherEducationReferralSubjects", "Subject", c => c.String(nullable: false, maxLength: 50));
        }
    }
}
