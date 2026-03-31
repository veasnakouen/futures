namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalFutureTrainingProgress : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.FutureTrainingProgresses", "Reason", c => c.String(maxLength: 250));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.FutureTrainingProgresses", "Reason", c => c.String(nullable: false, maxLength: 250));
        }
    }
}
