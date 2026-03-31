namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeSalaryToIntegerInVacancyModel : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Vacancies", "Salary", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Vacancies", "Salary", c => c.String(maxLength: 255));
        }
    }
}
