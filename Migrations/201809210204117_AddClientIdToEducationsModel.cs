namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddClientIdToEducationsModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Educations", "ClientId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Educations", "ClientId");
        }
    }
}
