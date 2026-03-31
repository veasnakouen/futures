namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterTableSocialCare : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SocialCares", "ClientId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SocialCares", "ClientId");
        }
    }
}
