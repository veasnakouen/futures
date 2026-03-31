namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableBusinessSetUp : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BusinessSetUps",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        BusinessSetUpCategoryId = c.Int(nullable: false),
                        BusinessType = c.String(nullable: false, maxLength: 255),
                        Income = c.String(),
                        Expense = c.String(),
                        JobPlaceBy = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.BusinessSetUpCategories", t => t.BusinessSetUpCategoryId)
                .ForeignKey("dbo.Clients", t => t.ClientId)
                .Index(t => t.ClientId)
                .Index(t => t.BusinessSetUpCategoryId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BusinessSetUps", "ClientId", "dbo.Clients");
            DropForeignKey("dbo.BusinessSetUps", "BusinessSetUpCategoryId", "dbo.BusinessSetUpCategories");
            DropIndex("dbo.BusinessSetUps", new[] { "BusinessSetUpCategoryId" });
            DropIndex("dbo.BusinessSetUps", new[] { "ClientId" });
            DropTable("dbo.BusinessSetUps");
        }
    }
}
