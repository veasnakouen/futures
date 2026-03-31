namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class alterModalVacancyaddsalarymax : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Vacancies", "Salarymax", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Vacancies", "Salarymax");
        }
    }
}
