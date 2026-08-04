-- MTP Microservices Ecosystem Initial Schema Reference
-- Compatible with Microsoft SQL Server, MySQL, and PostgreSQL

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id NVARCHAR(450) NOT NULL PRIMARY KEY,
        username NVARCHAR(256) NOT NULL,
        email NVARCHAR(256) NULL,
        passwordHash NVARCHAR(MAX) NULL,
        status NVARCHAR(50) DEFAULT 'ACTIVE'
    );
END;
