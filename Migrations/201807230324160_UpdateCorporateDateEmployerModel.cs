namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateCorporateDateEmployerModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Employers", "CorporateDate", c => c.DateTime(nullable: false));
            DropColumn("dbo.Employers", "EnrollDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Employers", "EnrollDate", c => c.DateTime(nullable: false));
            DropColumn("dbo.Employers", "CorporateDate");
        }
    }
}
