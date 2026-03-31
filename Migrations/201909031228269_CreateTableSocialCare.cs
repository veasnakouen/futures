namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableSocialCare : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SocialCares",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SocialSupportNeeded = c.Boolean(nullable: false),
                        MeetingFuture = c.Boolean(nullable: false),
                        Problem = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.SocialCares");
        }
    }
}
