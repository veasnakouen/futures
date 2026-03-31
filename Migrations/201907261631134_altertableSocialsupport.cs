namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class altertableSocialsupport : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.SocialSupports", "CaseId", "dbo.Cases");
            DropIndex("dbo.SocialSupports", new[] { "CaseId" });
            DropColumn("dbo.SocialSupports", "CaseId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.SocialSupports", "CaseId", c => c.Int(nullable: false));
            CreateIndex("dbo.SocialSupports", "CaseId");
            AddForeignKey("dbo.SocialSupports", "CaseId", "dbo.Cases", "Id");
        }
    }
}
