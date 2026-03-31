namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalPlacement : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Placements", "Status", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Placements", "Status");
        }
    }
}
