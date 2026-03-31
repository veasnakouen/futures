namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterTableCaseWorker : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CaseWorkers", "Program", c => c.String(nullable: false, maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("dbo.CaseWorkers", "Program");
        }
    }
}
