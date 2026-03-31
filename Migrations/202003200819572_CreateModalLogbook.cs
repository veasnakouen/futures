namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateModalLogbook : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LogBooks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Gender = c.String(maxLength: 6),
                        Phone = c.String(maxLength: 50),
                        Note = c.String(maxLength: 256),
                        Jobinformation = c.Boolean(nullable: false),
                        Library = c.Boolean(nullable: false),
                        UsingComputer = c.Boolean(nullable: false),
                        FutureService = c.Boolean(nullable: false),
                        InterviewTechic = c.Boolean(nullable: false),
                        ShortTraining = c.Boolean(nullable: false),
                        User = c.String(),
                        EnrollDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.LogBooks");
        }
    }
}
