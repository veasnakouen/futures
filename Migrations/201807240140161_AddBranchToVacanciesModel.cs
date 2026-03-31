namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBranchToVacanciesModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Vacancies", "Branch", c => c.String(maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Vacancies", "Branch");
        }
    }
}
