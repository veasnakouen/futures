namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalClientAspnetuseridFixError2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Clients", "AspUserId", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Clients", "AspUserId", c => c.String());
        }
    }
}
