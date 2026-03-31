namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddClientsModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Clients",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Branch = c.String(nullable: false, maxLength: 255),
                        FirstName = c.String(nullable: false, maxLength: 255),
                        LastName = c.String(nullable: false, maxLength: 255),
                        Gender = c.String(maxLength: 6),
                        DateOfBirth = c.DateTime(),
                        ContactPhone = c.String(maxLength: 255),
                        RelativePhone = c.String(maxLength: 255),
                        MaritalStatus = c.String(maxLength: 10),
                        Email = c.String(maxLength: 255),
                        Address = c.String(maxLength: 255),
                        Province = c.String(maxLength: 255),
                        Photo = c.String(maxLength: 255),
                        CurrentSituation = c.String(maxLength: 255),
                        FurtherEducation = c.Boolean(nullable: false),
                        Placement = c.Boolean(nullable: false),
                        TrainingFromFutures = c.Boolean(nullable: false),
                        SocialSupportRequired = c.Boolean(nullable: false),
                        HearBy = c.String(maxLength: 255),
                        EnrollBy = c.String(maxLength: 255),
                        EnrollDate = c.DateTime(),
                        Status = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Clients");
        }
    }
}
