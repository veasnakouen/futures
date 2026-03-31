namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalFurtherEducationReferral1 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.FurtherEducationReferrals", "ClientId");
            AddForeignKey("dbo.FurtherEducationReferrals", "ClientId", "dbo.Clients", "Id");
            DropColumn("dbo.FurtherEducationReferrals", "ClientType");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FurtherEducationReferrals", "ClientType", c => c.String());
            DropForeignKey("dbo.FurtherEducationReferrals", "ClientId", "dbo.Clients");
            DropIndex("dbo.FurtherEducationReferrals", new[] { "ClientId" });
        }
    }
}
