namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCasesModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Cases",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        AgentId = c.Int(nullable: false),
                        Priority = c.String(nullable: false, maxLength: 50),
                        ServiceType = c.String(nullable: false, maxLength: 50),
                        Subject = c.String(maxLength: 255),
                        Description = c.String(maxLength: 510),
                        OpenDate = c.DateTime(nullable: false),
                        CloseDate = c.DateTime(),
                        Status = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Agents", t => t.AgentId)
                .ForeignKey("dbo.Clients", t => t.ClientId)
                .Index(t => t.ClientId)
                .Index(t => t.AgentId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Cases", "ClientId", "dbo.Clients");
            DropForeignKey("dbo.Cases", "AgentId", "dbo.Agents");
            DropIndex("dbo.Cases", new[] { "AgentId" });
            DropIndex("dbo.Cases", new[] { "ClientId" });
            DropTable("dbo.Cases");
        }
    }
}
