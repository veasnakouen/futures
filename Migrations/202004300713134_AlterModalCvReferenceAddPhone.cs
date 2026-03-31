namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalCvReferenceAddPhone : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CvReferences", "Organization", c => c.String());
            AddColumn("dbo.CvReferences", "Phone", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.CvReferences", "Phone");
            DropColumn("dbo.CvReferences", "Organization");
        }
    }
}
