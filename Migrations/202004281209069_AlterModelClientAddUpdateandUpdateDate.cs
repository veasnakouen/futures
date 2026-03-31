namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModelClientAddUpdateandUpdateDate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "UpdateDate", c => c.DateTime());
            AddColumn("dbo.Clients", "UpdateBy", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Clients", "UpdateBy");
            DropColumn("dbo.Clients", "UpdateDate");
        }
    }
}
