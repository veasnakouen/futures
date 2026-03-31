namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddJobExpectationsModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.JobExpectations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        JobCategoryIdOne = c.Int(),
                        JobCategoryIdTwo = c.Int(),
                        JobCategoryIdThree = c.Int(),
                        JobPositionIdOne = c.Int(),
                        JobPositionIdTwo = c.Int(),
                        JobPositionIdThree = c.Int(),
                        Permanent = c.Boolean(nullable: false),
                        Temporary = c.Boolean(nullable: false),
                        Seasonal = c.Boolean(nullable: false),
                        AvailableTime = c.String(maxLength: 255),
                        SalaryExpectation = c.String(maxLength: 255),
                        Note = c.String(maxLength: 510),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.JobExpectations");
        }
    }
}
