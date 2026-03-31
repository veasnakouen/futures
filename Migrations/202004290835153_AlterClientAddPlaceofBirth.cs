namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterClientAddPlaceofBirth : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "PlaceOfBirth", c => c.String());
            AddColumn("dbo.Clients", "Nationality", c => c.String());
            AddColumn("dbo.Clients", "Citizenship", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Clients", "Citizenship");
            DropColumn("dbo.Clients", "Nationality");
            DropColumn("dbo.Clients", "PlaceOfBirth");
        }
    }
}
