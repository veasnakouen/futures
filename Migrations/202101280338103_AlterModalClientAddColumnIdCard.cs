namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalClientAddColumnIdCard : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "IdCard", c => c.String(maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Clients", "IdCard");
        }
    }
}
