namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddVacancyModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Vacancies",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PostingDate = c.DateTime(nullable: false),
                        Deadline = c.DateTime(nullable: false),
                        EmployerId = c.Int(nullable: false),
                        JobPositionId = c.Int(nullable: false),
                        PositionAvailable = c.Int(nullable: false),
                        ContractType = c.String(maxLength: 255),
                        Schedule = c.String(maxLength: 255),
                        Salary = c.String(maxLength: 255),
                        Location = c.String(maxLength: 510),
                        Responsibilities = c.String(),
                        Requirement = c.String(),
                        ApplicationInformation = c.String(),
                        Status = c.String(nullable: false),
                        ViewCount = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Employers", t => t.EmployerId)
                .ForeignKey("dbo.JobPositions", t => t.JobPositionId)
                .Index(t => t.EmployerId)
                .Index(t => t.JobPositionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Vacancies", "JobPositionId", "dbo.JobPositions");
            DropForeignKey("dbo.Vacancies", "EmployerId", "dbo.Employers");
            DropIndex("dbo.Vacancies", new[] { "JobPositionId" });
            DropIndex("dbo.Vacancies", new[] { "EmployerId" });
            DropTable("dbo.Vacancies");
        }
    }
}
