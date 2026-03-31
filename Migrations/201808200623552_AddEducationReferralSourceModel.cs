namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddEducationReferralSourceModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EducationReferralSources",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ReferralSource = c.String(nullable: false),
                        Status = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.EducationReferralSources");
        }
    }
}
