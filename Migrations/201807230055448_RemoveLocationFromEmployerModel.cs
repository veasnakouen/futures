namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveLocationFromEmployerModel : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Employers", "Location");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Employers", "Location", c => c.String(nullable: false, maxLength: 255));
        }
    }
}
