-- Add JobCategoryId column to JobPositions table
-- Run this script in SQL Server Management Studio or sqlcmd against MtpAppDB2018_full

USE MtpAppDB2018_full;
GO

-- Add the column if it doesn't exist
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[JobPositions]') 
    AND name = 'JobCategoryId'
)
BEGIN
    ALTER TABLE [dbo].[JobPositions]
    ADD JobCategoryId INT NULL;
    
    PRINT 'JobCategoryId column added to JobPositions table';
END
ELSE
BEGIN
    PRINT 'JobCategoryId column already exists in JobPositions table';
END
GO

-- Add foreign key constraint
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys 
    WHERE name = 'FK_dbo_JobPositions_dbo_JobCategories_JobCategoryId'
    AND parent_object_id = OBJECT_ID(N'[dbo].[JobPositions]')
)
BEGIN
    ALTER TABLE [dbo].[JobPositions]
    ADD CONSTRAINT FK_dbo_JobPositions_dbo_JobCategories_JobCategoryId
    FOREIGN KEY (JobCategoryId) REFERENCES [dbo].[JobCategories](Id);
    
    PRINT 'Foreign key constraint added';
END
ELSE
BEGIN
    PRINT 'Foreign key constraint already exists';
END
GO

-- Create index for better performance
IF NOT EXISTS (
    SELECT * FROM sys.indexes 
    WHERE name = 'IX_JobPositions_JobCategoryId'
    AND object_id = OBJECT_ID(N'[dbo].[JobPositions]')
)
BEGIN
    CREATE INDEX IX_JobPositions_JobCategoryId
    ON [dbo].[JobPositions](JobCategoryId);
    
    PRINT 'Index created on JobCategoryId';
END
ELSE
BEGIN
    PRINT 'Index already exists on JobCategoryId';
END
GO

PRINT 'Migration completed successfully!';
GO
