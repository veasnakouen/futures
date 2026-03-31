namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ExtendedClientRegisterModelV1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "RegisterDateNd", c => c.DateTime());
            AddColumn("dbo.Clients", "RegisterDateRd", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Clients", "RegisterDateRd");
            DropColumn("dbo.Clients", "RegisterDateNd");
        }
    }
}
