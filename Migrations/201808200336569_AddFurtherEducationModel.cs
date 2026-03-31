namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFurtherEducationModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FurtherEducations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        University = c.Boolean(nullable: false),
                        PublicSchool = c.Boolean(nullable: false),
                        VocationalTraining = c.Boolean(nullable: false),
                        ComputerSchool = c.Boolean(nullable: false),
                        EnglishSchool = c.Boolean(nullable: false),
                        ChineseSchool = c.Boolean(nullable: false),
                        AvailableTime = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.FurtherEducations");
        }
    }
}
