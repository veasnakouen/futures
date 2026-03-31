namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddEnrollDateToEmployerModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Employers", "EnrollDate", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Employers", "EnrollDate");
        }
    }
}
