namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterTableSocialSupportProblem : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SocialSupportProblems", "Status", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.SocialSupportProblems", "Status");
        }
    }
}
