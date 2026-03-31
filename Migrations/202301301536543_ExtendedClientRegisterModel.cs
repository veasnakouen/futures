namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ExtendedClientRegisterModel : DbMigration
    {
        public override void Up()
        {
            
        }
        
        public override void Down()
        {
            AddColumn("dbo.Clients", "RegisterDateRd", c => c.DateTime());
            AddColumn("dbo.Clients", "RegisterDateNd", c => c.DateTime());
        }
    }
}
