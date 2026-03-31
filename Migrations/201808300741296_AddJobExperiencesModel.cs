namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddJobExperiencesModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.JobExperiences",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        JobPositionId = c.Int(nullable: false),
                        Employer = c.String(maxLength: 255),
                        JobCategoryId = c.Int(nullable: false),
                        Duration = c.String(maxLength: 255),
                        Salary = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.JobExperiences");
        }
    }
}
