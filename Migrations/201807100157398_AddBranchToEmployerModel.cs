namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBranchToEmployerModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Employers", "Branch", c => c.String(maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Employers", "Branch");
        }
    }
}
