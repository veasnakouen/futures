namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AterTableSocialSupport : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.SocialSupports", "SocialSupportNeeded");
            DropColumn("dbo.SocialSupports", "MeetingFuture");
            DropColumn("dbo.SocialSupports", "Problem");
        }
        
        public override void Down()
        {
            AddColumn("dbo.SocialSupports", "Problem", c => c.Boolean(nullable: false));
            AddColumn("dbo.SocialSupports", "MeetingFuture", c => c.Boolean(nullable: false));
            AddColumn("dbo.SocialSupports", "SocialSupportNeeded", c => c.Boolean(nullable: false));
        }
    }
}
