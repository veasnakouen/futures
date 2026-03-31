namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterJobExpectation2020Aug05 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.JobExpectations", "BusinessSetUpCategoryId", "dbo.BusinessSetUpCategories");
            DropIndex("dbo.JobExpectations", new[] { "BusinessSetUpCategoryId" });
        }
        
        public override void Down()
        {
            CreateIndex("dbo.JobExpectations", "BusinessSetUpCategoryId");
            AddForeignKey("dbo.JobExpectations", "BusinessSetUpCategoryId", "dbo.BusinessSetUpCategories", "Id");
        }
    }
}
