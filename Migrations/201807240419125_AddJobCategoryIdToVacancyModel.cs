namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddJobCategoryIdToVacancyModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Vacancies", "JobCategoryId", c => c.Int(nullable: false));
            CreateIndex("dbo.Vacancies", "JobCategoryId");
            AddForeignKey("dbo.Vacancies", "JobCategoryId", "dbo.JobCategories", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Vacancies", "JobCategoryId", "dbo.JobCategories");
            DropIndex("dbo.Vacancies", new[] { "JobCategoryId" });
            DropColumn("dbo.Vacancies", "JobCategoryId");
        }
    }
}
