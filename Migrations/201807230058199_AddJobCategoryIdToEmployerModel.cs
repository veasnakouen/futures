namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddJobCategoryIdToEmployerModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Employers", "JobCategoryId", c => c.Int(nullable: false));
            CreateIndex("dbo.Employers", "JobCategoryId");
            AddForeignKey("dbo.Employers", "JobCategoryId", "dbo.JobCategories", "Id");
            DropColumn("dbo.Employers", "Sector");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Employers", "Sector", c => c.String(nullable: false, maxLength: 255));
            DropForeignKey("dbo.Employers", "JobCategoryId", "dbo.JobCategories");
            DropIndex("dbo.Employers", new[] { "JobCategoryId" });
            DropColumn("dbo.Employers", "JobCategoryId");
        }
    }
}
