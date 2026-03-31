namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateModalFurtherEducationSubject : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.furtherEducationReferralSubjects",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Subject = c.String(nullable: false, maxLength: 50),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.furtherEducationReferralSubjects");
        }
    }
}
