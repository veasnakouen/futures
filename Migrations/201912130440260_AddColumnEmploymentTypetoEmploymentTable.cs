namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddColumnEmploymentTypetoEmploymentTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobExpectations", "EmploymentType", c => c.String(maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobExpectations", "EmploymentType");
        }
    }
}
