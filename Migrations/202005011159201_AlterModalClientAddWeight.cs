namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalClientAddWeight : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "Weight", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Clients", "Weight");
        }
    }
}
