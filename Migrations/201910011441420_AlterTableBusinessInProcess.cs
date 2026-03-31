namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterTableBusinessInProcess : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.BusinessInProgresses", "StillInbusiness", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.BusinessInProgresses", "StillInbusiness", c => c.Int(nullable: false));
        }
    }
}
