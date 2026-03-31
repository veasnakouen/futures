namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableFuturesTraining : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FuturesTrainings",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        SubjectId = c.Int(nullable: false),
                        OpenDate = c.DateTime(nullable: false),
                        CloseDate = c.DateTime(),
                        Note = c.String(maxLength: 255),
                        Status = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("dbo.Clients", t => t.ClientId)
                .ForeignKey("dbo.Subjects", t => t.SubjectId)
                .Index(t => t.ClientId)
                .Index(t => t.SubjectId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FuturesTrainings", "SubjectId", "dbo.Subjects");
            DropForeignKey("dbo.FuturesTrainings", "ClientId", "dbo.Clients");
            DropIndex("dbo.FuturesTrainings", new[] { "SubjectId" });
            DropIndex("dbo.FuturesTrainings", new[] { "ClientId" });
            DropTable("dbo.FuturesTrainings");
        }
    }
}
