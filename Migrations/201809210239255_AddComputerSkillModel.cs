namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddComputerSkillModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ComputerSkills",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        Skill = c.String(nullable: false, maxLength: 255),
                        Level = c.String(maxLength: 255),
                        Certified = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ComputerSkills");
        }
    }
}
