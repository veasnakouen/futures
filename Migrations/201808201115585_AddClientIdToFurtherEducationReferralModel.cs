namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddClientIdToFurtherEducationReferralModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FurtherEducationReferrals", "ClientId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.FurtherEducationReferrals", "ClientId");
        }
    }
}
