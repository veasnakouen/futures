-- Simplified self-healing script for MS SQL Server
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[AspNetUsers]') AND name = 'IsActive')
    ALTER TABLE AspNetUsers ADD IsActive BIT NOT NULL DEFAULT 1;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[AspNetUsers]') AND name = 'PasswordText')
    ALTER TABLE AspNetUsers ADD PasswordText NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[provinces]') AND name = 'postcode')
    ALTER TABLE provinces ADD postcode NVARCHAR(255) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[districts]') AND name = 'postcode')
    ALTER TABLE districts ADD postcode NVARCHAR(255) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[communes]') AND name = 'postcode')
    ALTER TABLE communes ADD postcode NVARCHAR(255) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[villages]') AND name = 'postcode')
    ALTER TABLE villages ADD postcode NVARCHAR(255) NULL;
