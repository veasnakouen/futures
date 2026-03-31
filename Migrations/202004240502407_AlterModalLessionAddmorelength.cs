namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalLessionAddmorelength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Lessions", "LessionSub", c => c.String(nullable: false, maxLength: 255));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Lessions", "LessionSub", c => c.String(nullable: false, maxLength: 50));
        }
    }
}
