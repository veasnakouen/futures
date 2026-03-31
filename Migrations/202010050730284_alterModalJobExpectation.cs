namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class alterModalJobExpectation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobExpectations", "ExpectationStatus", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobExpectations", "ExpectationStatus");
        }
    }
}
