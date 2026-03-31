namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddEmployerModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Employers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 255),
                        Sector = c.String(nullable: false, maxLength: 255),
                        Location = c.String(nullable: false, maxLength: 255),
                        Address = c.String(maxLength: 510),
                        ContactPerson = c.String(nullable: false, maxLength: 255),
                        ContactPhone = c.String(maxLength: 255),
                        Email = c.String(maxLength: 255),
                        Website = c.String(maxLength: 255),
                        Note = c.String(maxLength: 510),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Employers");
        }
    }
}
