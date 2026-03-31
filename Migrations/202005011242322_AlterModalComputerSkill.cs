namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlterModalComputerSkill : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ComputerSkills", "During", c => c.String());
            AddColumn("dbo.ComputerSkills", "Description", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ComputerSkills", "Description");
            DropColumn("dbo.ComputerSkills", "During");
        }
    }
}
