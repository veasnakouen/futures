namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalJobExpectationHobby : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobExpectations", "Hobby", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobExpectations", "Hobby");
        }
    }
}
