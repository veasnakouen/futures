namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateAgentToCaseWorkerInCasesModel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Cases", "AgentId", "dbo.Agents");
            DropIndex("dbo.Cases", new[] { "AgentId" });
            AddColumn("dbo.Cases", "CaseWorkerId", c => c.Int(nullable: false));
            CreateIndex("dbo.Cases", "CaseWorkerId");
            AddForeignKey("dbo.Cases", "CaseWorkerId", "dbo.CaseWorkers", "Id");
            DropColumn("dbo.Cases", "AgentId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Cases", "AgentId", c => c.Int(nullable: false));
            DropForeignKey("dbo.Cases", "CaseWorkerId", "dbo.CaseWorkers");
            DropIndex("dbo.Cases", new[] { "CaseWorkerId" });
            DropColumn("dbo.Cases", "CaseWorkerId");
            CreateIndex("dbo.Cases", "AgentId");
            AddForeignKey("dbo.Cases", "AgentId", "dbo.Agents", "Id");
        }
    }
}
