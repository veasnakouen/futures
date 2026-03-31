namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalCvreferenceAddEmail : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CvReferences", "Email", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.CvReferences", "Email");
        }
    }
}
