namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalJobExpectationCandidate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobExpectations", "Candidate", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobExpectations", "Candidate");
        }
    }
}
