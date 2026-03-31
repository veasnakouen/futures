namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditJobExperienceModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobExperiences", "JobExperiences_Id", c => c.Int());
            CreateIndex("dbo.JobExperiences", "JobCategoryId");
            CreateIndex("dbo.JobExperiences", "JobExperiences_Id");
            AddForeignKey("dbo.JobExperiences", "JobCategoryId", "dbo.JobCategories", "Id");
            AddForeignKey("dbo.JobExperiences", "JobExperiences_Id", "dbo.JobExperiences", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.JobExperiences", "JobExperiences_Id", "dbo.JobExperiences");
            DropForeignKey("dbo.JobExperiences", "JobCategoryId", "dbo.JobCategories");
            DropIndex("dbo.JobExperiences", new[] { "JobExperiences_Id" });
            DropIndex("dbo.JobExperiences", new[] { "JobCategoryId" });
            DropColumn("dbo.JobExperiences", "JobExperiences_Id");
        }
    }
}
