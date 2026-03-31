namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalJobExperieceAddDecription : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobExperiences", "Description", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobExperiences", "Description");
        }
    }
}
