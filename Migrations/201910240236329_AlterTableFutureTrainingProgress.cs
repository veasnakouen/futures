namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterTableFutureTrainingProgress : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.FutureTrainingProgresses", "GraduateDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.FutureTrainingProgresses", "GraduateDate", c => c.DateTime(nullable: false));
        }
    }
}
