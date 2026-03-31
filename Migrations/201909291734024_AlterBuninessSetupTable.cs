namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterBuninessSetupTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BusinessSetUps", "CountTime", c => c.String(nullable: false, maxLength: 255));
            AlterColumn("dbo.BusinessSetUps", "Income", c => c.String(nullable: false, maxLength: 255));
            AlterColumn("dbo.BusinessSetUps", "Expense", c => c.String(nullable: false, maxLength: 255));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.BusinessSetUps", "Expense", c => c.String());
            AlterColumn("dbo.BusinessSetUps", "Income", c => c.String());
            DropColumn("dbo.BusinessSetUps", "CountTime");
        }
    }
}
