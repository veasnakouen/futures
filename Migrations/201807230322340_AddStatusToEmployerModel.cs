namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddStatusToEmployerModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Employers", "Status", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Employers", "Status");
        }
    }
}
