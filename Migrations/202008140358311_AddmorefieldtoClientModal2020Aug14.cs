namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddmorefieldtoClientModal2020Aug14 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Clients", "SocialSupportProblem", c => c.String());
            AddColumn("dbo.Clients", "IdpoorStatus", c => c.String(maxLength: 50));
            AddColumn("dbo.Clients", "IdpoorValiddate", c => c.DateTime());
            AddColumn("dbo.Clients", "IdpoorLevel", c => c.String());
            AddColumn("dbo.Clients", "IdpoorAccountNumber", c => c.String(maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Clients", "IdpoorAccountNumber");
            DropColumn("dbo.Clients", "IdpoorLevel");
            DropColumn("dbo.Clients", "IdpoorValiddate");
            DropColumn("dbo.Clients", "IdpoorStatus");
            DropColumn("dbo.Clients", "SocialSupportProblem");
        }
    }
}
