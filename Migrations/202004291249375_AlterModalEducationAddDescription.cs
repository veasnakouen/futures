namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalEducationAddDescription : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Educations", "Description", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Educations", "Description");
        }
    }
}
