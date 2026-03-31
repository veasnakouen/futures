namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalfurtherEducationReferralAddmoreclientType : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FurtherEducationReferrals", "clientType", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.FurtherEducationReferrals", "clientType");
        }
    }
}
