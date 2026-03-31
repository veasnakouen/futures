namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsDeletedToJobPositionModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobPositions", "IsDeleted", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobPositions", "IsDeleted");
        }
    }
}
