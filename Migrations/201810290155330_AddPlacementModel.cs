namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPlacementModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Placements",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PlacementDate = c.DateTime(nullable: false),
                        PlacementType = c.String(nullable: false, maxLength: 255),
                        JobPositionId = c.Int(nullable: false),
                        CompanyName = c.String(nullable: false, maxLength: 255),
                        CompanyContactName = c.String(maxLength: 255),
                        CompanyContactPhone = c.String(maxLength: 255),
                        CompanyContactEmail = c.String(maxLength: 255),
                        CompanyAddress = c.String(maxLength: 255),
                        JobPlacedBy = c.String(nullable: false, maxLength: 255),
                        Salary = c.String(maxLength: 255),
                        Tips = c.String(maxLength: 255),
                        TotalIncome = c.String(maxLength: 255),
                        WorkTime = c.String(maxLength: 255),
                        DayOff = c.String(maxLength: 255),
                        NumberOfAnnualLeave = c.String(maxLength: 255),
                        Health = c.Boolean(nullable: false),
                        Meal = c.Boolean(nullable: false),
                        Transport = c.Boolean(nullable: false),
                        Bonus = c.Boolean(nullable: false),
                        PublicHoliday = c.Boolean(nullable: false),
                        AccidentInsurance = c.Boolean(nullable: false),
                        Accommodation = c.Boolean(nullable: false),
                        Overtime = c.Boolean(nullable: false),
                        ThirteenMonthsSalary = c.Boolean(nullable: false),
                        AnnualLeave = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.JobPositions", t => t.JobPositionId)
                .Index(t => t.JobPositionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Placements", "JobPositionId", "dbo.JobPositions");
            DropIndex("dbo.Placements", new[] { "JobPositionId" });
            DropTable("dbo.Placements");
        }
    }
}
