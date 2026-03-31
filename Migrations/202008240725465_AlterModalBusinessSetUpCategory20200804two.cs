namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalBusinessSetUpCategory20200804two : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobExpectations", "BusinessType", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobExpectations", "BusinessType");
        }
    }
}
