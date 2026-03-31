namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class alterTableSocialSupports2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SocialSupports", "CaseId", c => c.Int(nullable: false));
            CreateIndex("dbo.SocialSupports", "CaseId");
            AddForeignKey("dbo.SocialSupports", "CaseId", "dbo.Cases", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SocialSupports", "CaseId", "dbo.Cases");
            DropIndex("dbo.SocialSupports", new[] { "CaseId" });
            DropColumn("dbo.SocialSupports", "CaseId");
        }
    }
}
