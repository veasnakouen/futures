namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalBusinessInProgressBusinessSetUpCategoryId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BusinessInProgresses", "BusinessSetUpCategoryId", c => c.Int(nullable: false));
            CreateIndex("dbo.BusinessInProgresses", "BusinessSetUpCategoryId");
            AddForeignKey("dbo.BusinessInProgresses", "BusinessSetUpCategoryId", "dbo.BusinessSetUpCategories", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BusinessInProgresses", "BusinessSetUpCategoryId", "dbo.BusinessSetUpCategories");
            DropIndex("dbo.BusinessInProgresses", new[] { "BusinessSetUpCategoryId" });
            DropColumn("dbo.BusinessInProgresses", "BusinessSetUpCategoryId");
        }
    }
}
