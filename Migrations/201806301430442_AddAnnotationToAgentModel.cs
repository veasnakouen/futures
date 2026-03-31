namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAnnotationToAgentModel : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Agents", "Name", c => c.String(nullable: false, maxLength: 255));
            AlterColumn("dbo.Agents", "Photo", c => c.String(nullable: false, maxLength: 510));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Agents", "Photo", c => c.String());
            AlterColumn("dbo.Agents", "Name", c => c.String());
        }
    }
}
