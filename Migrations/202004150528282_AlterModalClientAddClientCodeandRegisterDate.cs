namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalClientAddClientCodeandRegisterDate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "ClientCode", c => c.String(nullable: false, maxLength: 50));
            AddColumn("dbo.Clients", "RegisterDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Clients", "RegisterDate");
            DropColumn("dbo.Clients", "ClientCode");
        }
    }
}
