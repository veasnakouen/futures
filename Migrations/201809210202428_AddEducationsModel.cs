namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddEducationsModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Educations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Level = c.String(nullable: false, maxLength: 255),
                        Grade = c.String(maxLength: 255),
                        Subject = c.String(maxLength: 255),
                        Year = c.String(maxLength: 255),
                        SchoolName = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Educations");
        }
    }
}
