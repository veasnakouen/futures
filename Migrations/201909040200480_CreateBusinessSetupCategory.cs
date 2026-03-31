namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateBusinessSetupCategory : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BusinessSetUpCategories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        BusCategoryName = c.String(nullable: false, maxLength: 255),
                        IsDeleted = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.BusinessSetUpCategories");
        }
    }
}
