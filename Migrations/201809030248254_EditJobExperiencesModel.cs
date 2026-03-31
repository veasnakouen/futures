namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditJobExperiencesModel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.JobExperiences", "JobExperiences_Id", "dbo.JobExperiences");
            DropIndex("dbo.JobExperiences", new[] { "JobExperiences_Id" });
            CreateIndex("dbo.JobExperiences", "JobPositionId");
            AddForeignKey("dbo.JobExperiences", "JobPositionId", "dbo.JobPositions", "Id");
            DropColumn("dbo.JobExperiences", "JobExperiences_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.JobExperiences", "JobExperiences_Id", c => c.Int());
            DropForeignKey("dbo.JobExperiences", "JobPositionId", "dbo.JobPositions");
            DropIndex("dbo.JobExperiences", new[] { "JobPositionId" });
            CreateIndex("dbo.JobExperiences", "JobExperiences_Id");
            AddForeignKey("dbo.JobExperiences", "JobExperiences_Id", "dbo.JobExperiences", "Id");
        }
    }
}
