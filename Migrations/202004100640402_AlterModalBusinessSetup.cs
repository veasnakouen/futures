namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalBusinessSetup : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BusinessSetUps", "StartBusinessSetUpDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.BusinessSetUps", "StartBusinessSetUpDate");
        }
    }
}
