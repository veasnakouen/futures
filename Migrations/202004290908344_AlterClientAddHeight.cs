namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterClientAddHeight : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "Height", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Clients", "Height");
        }
    }
}
