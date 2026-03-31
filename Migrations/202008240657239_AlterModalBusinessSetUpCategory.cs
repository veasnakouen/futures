namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalBusinessSetUpCategory : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobExpectations", "SelfEmployment", c => c.String());
            AddColumn("dbo.JobExpectations", "BusinessSetUpCategoryId", c => c.Int());
            CreateIndex("dbo.JobExpectations", "BusinessSetUpCategoryId");
            AddForeignKey("dbo.JobExpectations", "BusinessSetUpCategoryId", "dbo.BusinessSetUpCategories", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.JobExpectations", "BusinessSetUpCategoryId", "dbo.BusinessSetUpCategories");
            DropIndex("dbo.JobExpectations", new[] { "BusinessSetUpCategoryId" });
            DropColumn("dbo.JobExpectations", "BusinessSetUpCategoryId");
            DropColumn("dbo.JobExpectations", "SelfEmployment");
        }
    }
}
