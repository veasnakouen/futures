-- ============================================================
-- Migrate ASP.NET Identity schema from .NET Framework -> .NET 8
-- Run this against your MtpAppDB database
-- ============================================================

-- 1. AspNetUsers: Add missing ASP.NET Core Identity columns
PRINT 'Updating AspNetUsers...';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'NormalizedEmail')
    ALTER TABLE dbo.AspNetUsers ADD NormalizedEmail NVARCHAR(256) NULL;
    PRINT '  Added NormalizedEmail';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'NormalizedUserName')
    ALTER TABLE dbo.AspNetUsers ADD NormalizedUserName NVARCHAR(256) NULL;
    PRINT '  Added NormalizedUserName';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'ConcurrencyStamp')
    ALTER TABLE dbo.AspNetUsers ADD ConcurrencyStamp NVARCHAR(MAX) NULL;
    PRINT '  Added ConcurrencyStamp';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'LockoutEnd')
    ALTER TABLE dbo.AspNetUsers ADD LockoutEnd DATETIMEOFFSET NULL;
    PRINT '  Added LockoutEnd';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'LockoutEnabled')
    ALTER TABLE dbo.AspNetUsers ADD LockoutEnabled BIT NOT NULL DEFAULT 0;
    PRINT '  Added LockoutEnabled';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'AccessFailedCount')
    ALTER TABLE dbo.AspNetUsers ADD AccessFailedCount INT NOT NULL DEFAULT 0;
    PRINT '  Added AccessFailedCount';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'PhoneNumberConfirmed')
    ALTER TABLE dbo.AspNetUsers ADD PhoneNumberConfirmed BIT NOT NULL DEFAULT 0;
    PRINT '  Added PhoneNumberConfirmed';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'EmailConfirmed')
    ALTER TABLE dbo.AspNetUsers ADD EmailConfirmed BIT NOT NULL DEFAULT 0;
    PRINT '  Added EmailConfirmed';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetUsers') AND name = 'TwoFactorEnabled')
    ALTER TABLE dbo.AspNetUsers ADD TwoFactorEnabled BIT NOT NULL DEFAULT 0;
    PRINT '  Added TwoFactorEnabled';

-- 2. AspNetRoles: Add missing ASP.NET Core Identity columns
PRINT 'Updating AspNetRoles...';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetRoles') AND name = 'NormalizedName')
    ALTER TABLE dbo.AspNetRoles ADD NormalizedName NVARCHAR(256) NULL;
    PRINT '  Added NormalizedName';

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.AspNetRoles') AND name = 'ConcurrencyStamp')
    ALTER TABLE dbo.AspNetRoles ADD ConcurrencyStamp NVARCHAR(MAX) NULL;
    PRINT '  Added ConcurrencyStamp';

GO

-- 3. Backfill data for existing users
PRINT 'Backfilling user data...';

UPDATE dbo.AspNetUsers
SET 
    NormalizedEmail = UPPER(ISNULL(Email, '')),
    NormalizedUserName = UPPER(ISNULL(UserName, '')),
    LockoutEnabled = 0,
    AccessFailedCount = 0,
    PhoneNumberConfirmed = 0,
    EmailConfirmed = 1,
    TwoFactorEnabled = 0
WHERE NormalizedEmail IS NULL;

UPDATE dbo.AspNetUsers
SET ConcurrencyStamp = CAST(NEWID() AS NVARCHAR(MAX))
WHERE ConcurrencyStamp IS NULL;

-- 4. Backfill data for existing roles
PRINT 'Backfilling role data...';

UPDATE dbo.AspNetRoles
SET 
    NormalizedName = UPPER(ISNULL(Name, '')),
    ConcurrencyStamp = CAST(NEWID() AS NVARCHAR(MAX))
WHERE NormalizedName IS NULL OR ConcurrencyStamp IS NULL;

-- 5. Verify
PRINT 'Verifying columns...';

SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'AspNetUsers' 
ORDER BY ORDINAL_POSITION;

SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'AspNetRoles' 
ORDER BY ORDINAL_POSITION;

PRINT 'Migration complete! Restart your application and try logging in again.';
