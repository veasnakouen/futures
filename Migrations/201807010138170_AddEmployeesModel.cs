namespace MtpApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddEmployeesModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Employees",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        IdNo = c.String(nullable: false, maxLength: 255),
                        Title = c.String(nullable: false, maxLength: 5),
                        FirstNameEnglish = c.String(nullable: false, maxLength: 255),
                        LastNameEnglish = c.String(nullable: false, maxLength: 255),
                        FirstNameKhmer = c.String(maxLength: 255),
                        LastNameKhmer = c.String(maxLength: 255),
                        Gender = c.String(maxLength: 6),
                        DateOfBirth = c.DateTime(),
                        PlaceOfBirth = c.String(maxLength: 255),
                        Address = c.String(maxLength: 255),
                        Country = c.String(maxLength: 255),
                        Nationality = c.String(maxLength: 255),
                        Email = c.String(maxLength: 255),
                        PhoneNumber = c.String(maxLength: 255),
                        BloodGroup = c.String(maxLength: 255),
                        BankAccountNumber = c.String(maxLength: 255),
                        BankAccount = c.String(maxLength: 255),
                        ContractDate = c.DateTime(),
                        ContractType = c.String(maxLength: 255),
                        ContractStartDate = c.DateTime(),
                        ContractEndDate = c.DateTime(),
                        Manager = c.String(maxLength: 255),
                        MaritalStatus = c.String(maxLength: 255),
                        Children = c.String(maxLength: 255),
                        EmergencyContact = c.String(maxLength: 255),
                        EmergencyContactName = c.String(maxLength: 255),
                        EmergencyContactPhone = c.String(maxLength: 255),
                        IdentityCardNumber = c.String(maxLength: 255),
                        IdentityCardType = c.String(maxLength: 255),
                        Note = c.String(maxLength: 255),
                        Photo = c.String(maxLength: 255),
                        Status = c.String(maxLength: 255),
                        PositionId = c.Int(nullable: false),
                        DepartmentId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Departments", t => t.DepartmentId, cascadeDelete: true)
                .ForeignKey("dbo.Positions", t => t.PositionId, cascadeDelete: true)
                .Index(t => t.PositionId)
                .Index(t => t.DepartmentId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Employees", "PositionId", "dbo.Positions");
            DropForeignKey("dbo.Employees", "DepartmentId", "dbo.Departments");
            DropIndex("dbo.Employees", new[] { "DepartmentId" });
            DropIndex("dbo.Employees", new[] { "PositionId" });
            DropTable("dbo.Employees");
        }
    }
}
