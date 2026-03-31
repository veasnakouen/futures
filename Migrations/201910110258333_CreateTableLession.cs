namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableLession : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Lessions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SubjectId = c.Int(nullable: false),
                        LessionSub = c.String(nullable: false, maxLength: 50),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Subjects", t => t.SubjectId)
                .Index(t => t.SubjectId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Lessions", "SubjectId", "dbo.Subjects");
            DropIndex("dbo.Lessions", new[] { "SubjectId" });
            DropTable("dbo.Lessions");
        }
    }
}
