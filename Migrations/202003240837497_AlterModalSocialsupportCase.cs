namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalSocialsupportCase : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SocialsupportCases", "Status", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SocialsupportCases", "Status");
        }
    }
}
