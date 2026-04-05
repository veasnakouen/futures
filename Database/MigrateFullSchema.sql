-- Step 1: Add missing columns to AspNetUsers
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='AspNetUsers' AND COLUMN_NAME='NormalizedUserName')
    ALTER TABLE AspNetUsers ADD NormalizedUserName NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='AspNetUsers' AND COLUMN_NAME='NormalizedEmail')
    ALTER TABLE AspNetUsers ADD NormalizedEmail NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='AspNetUsers' AND COLUMN_NAME='ConcurrencyStamp')
    ALTER TABLE AspNetUsers ADD ConcurrencyStamp NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='AspNetUsers' AND COLUMN_NAME='LockoutEnd')
    ALTER TABLE AspNetUsers ADD LockoutEnd DATETIMEOFFSET NULL;
GO

-- Step 2: Backfill AspNetUsers normalized values
UPDATE AspNetUsers SET
    NormalizedUserName = UPPER(UserName),
    NormalizedEmail    = UPPER(Email),
    ConcurrencyStamp   = CONVERT(NVARCHAR(MAX), NEWID()),
    LockoutEnd         = NULL
WHERE NormalizedEmail IS NULL OR ConcurrencyStamp IS NULL;
PRINT 'AspNetUsers: columns added and backfilled';
GO

-- Step 3: Add missing columns to AspNetRoles
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='AspNetRoles' AND COLUMN_NAME='NormalizedName')
    ALTER TABLE AspNetRoles ADD NormalizedName NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='AspNetRoles' AND COLUMN_NAME='ConcurrencyStamp')
    ALTER TABLE AspNetRoles ADD ConcurrencyStamp NVARCHAR(MAX) NULL;
GO

-- Step 4: Backfill AspNetRoles
UPDATE AspNetRoles SET
    NormalizedName   = UPPER(Name),
    ConcurrencyStamp = CONVERT(NVARCHAR(MAX), NEWID())
WHERE NormalizedName IS NULL;
PRINT 'AspNetRoles: columns added and backfilled';
GO

-- Step 5: Create AspNetRoleClaims (FK uses NVARCHAR(128) to match EF6 schema)
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='AspNetRoleClaims')
BEGIN
    CREATE TABLE AspNetRoleClaims (
        Id         INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        RoleId     NVARCHAR(128) NOT NULL,
        ClaimType  NVARCHAR(MAX) NULL,
        ClaimValue NVARCHAR(MAX) NULL,
        CONSTRAINT FK_AspNetRoleClaims_AspNetRoles FOREIGN KEY (RoleId) REFERENCES AspNetRoles(Id) ON DELETE CASCADE
    );
    PRINT 'AspNetRoleClaims: created';
END
ELSE
    PRINT 'AspNetRoleClaims: already exists';
GO

-- Step 6: Create AspNetUserTokens (FK uses NVARCHAR(128) to match EF6 schema)
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='AspNetUserTokens')
BEGIN
    CREATE TABLE AspNetUserTokens (
        UserId        NVARCHAR(128) NOT NULL,
        LoginProvider NVARCHAR(128) NOT NULL,
        Name          NVARCHAR(128) NOT NULL,
        Value         NVARCHAR(MAX) NULL,
        CONSTRAINT PK_AspNetUserTokens PRIMARY KEY (UserId, LoginProvider, Name),
        CONSTRAINT FK_AspNetUserTokens_AspNetUsers FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
    );
    PRINT 'AspNetUserTokens: created';
END
ELSE
    PRINT 'AspNetUserTokens: already exists';
GO

-- Verify
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE 'AspNet%' ORDER BY TABLE_NAME;
SELECT COUNT(*) AS UserCount FROM AspNetUsers;
