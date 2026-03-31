namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPersonalitiesModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Personalities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        Strength = c.String(maxLength: 510),
                        Weakness = c.String(maxLength: 510),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Personalities");
        }
    }
}
