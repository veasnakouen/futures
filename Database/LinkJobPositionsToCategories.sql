-- ============================================
-- Link Existing JobPositions to JobCategories
-- ============================================
-- This script assigns JobCategoryId to existing JobPositions based on their names
-- Run this in SQL Server Management Studio

USE MtpAppDB2018;
GO

-- First, let's see what JobCategories exist
SELECT '--- Available Job Categories ---' AS Info;
SELECT Id, Name FROM JobCategories;
GO

-- Now let's see what JobPositions exist
SELECT '--- Existing Job Positions (before update) ---' AS Info;
SELECT Id, Name, JobCategoryId FROM JobPositions WHERE IsDeleted = 0;
GO

-- ============================================
-- UPDATE JobPositions with appropriate JobCategoryId
-- ============================================
-- IMPORTANT: Adjust these category IDs based on your actual JobCategories
-- You can find the correct IDs from the query above

-- Example mapping (adjust IDs and position names to match your data):

-- Agriculture category (usually ID 1 or similar)
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%Agriculture%')
WHERE Name LIKE '%Farmer%' 
   OR Name LIKE '%Farm%' 
   OR Name LIKE '%Agriculture%'
   OR Name LIKE '%Gardener%'
   AND JobCategoryId IS NULL;

-- Art category
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%Art%')
WHERE Name LIKE '%Artist%' 
   OR Name LIKE '%Painter%' 
   OR Name LIKE '%Designer%' 
   OR Name LIKE '%Art%'
   AND JobCategoryId IS NULL;

-- Business category
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%Business%')
WHERE Name LIKE '%Manager%' 
   OR Name LIKE '%Business%' 
   OR Name LIKE '%Sales%' 
   OR Name LIKE '%Marketing%' 
   OR Name LIKE '%Accountant%'
   AND JobCategoryId IS NULL;

-- IT/Technology category
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%IT%' OR Name LIKE '%Technology%')
WHERE Name LIKE '%Developer%' 
   OR Name LIKE '%Programmer%' 
   OR Name LIKE '%IT%' 
   OR Name LIKE '%Computer%' 
   OR Name LIKE '%Technician%'
   AND JobCategoryId IS NULL;

-- Education/Teaching category
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%Education%' OR Name LIKE '%Teaching%')
WHERE Name LIKE '%Teacher%' 
   OR Name LIKE '%Educator%' 
   OR Name LIKE '%Tutor%' 
   OR Name LIKE '%Trainer%'
   AND JobCategoryId IS NULL;

-- Construction category
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%Construction%')
WHERE Name LIKE '%Construction%' 
   OR Name LIKE '%Builder%' 
   OR Name LIKE '%Carpenter%' 
   OR Name LIKE '%Electrician%' 
   OR Name LIKE '%Plumber%'
   AND JobCategoryId IS NULL;

-- Healthcare category
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%Health%' OR Name LIKE '%Medical%')
WHERE Name LIKE '%Nurse%' 
   OR Name LIKE '%Doctor%' 
   OR Name LIKE '%Health%' 
   OR Name LIKE '%Medical%' 
   OR Name LIKE '%Caregiver%'
   AND JobCategoryId IS NULL;

-- Service/Hospitality category
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%Service%' OR Name LIKE '%Hospitality%')
WHERE Name LIKE '%Waiter%' 
   OR Name LIKE '%Chef%' 
   OR Name LIKE '%Cook%' 
   OR Name LIKE '%Cleaner%' 
   OR Name LIKE '%Driver%'
   AND JobCategoryId IS NULL;

-- Manufacturing category
UPDATE JobPositions 
SET JobCategoryId = (SELECT TOP 1 Id FROM JobCategories WHERE Name LIKE '%Manufacturing%' OR Name LIKE '%Factory%')
WHERE Name LIKE '%Operator%' 
   OR Name LIKE '%Factory%' 
   OR Name LIKE '%Manufacturing%' 
   OR Name LIKE '%Worker%' 
   OR Name LIKE '%Assembler%'
   AND JobCategoryId IS NULL;

GO

-- ============================================
-- Verify the updates
-- ============================================
SELECT '--- Job Positions after update ---' AS Info;
SELECT 
    p.Id,
    p.Name AS PositionName,
    p.JobCategoryId,
    c.Name AS CategoryName
FROM JobPositions p
LEFT JOIN JobCategories c ON p.JobCategoryId = c.Id
WHERE p.IsDeleted = 0
ORDER BY c.Name, p.Name;
GO

PRINT 'Update completed! Check the results above to verify the assignments.';
PRINT 'If some positions still have NULL JobCategoryId, you can manually update them:';
PRINT 'UPDATE JobPositions SET JobCategoryId = X WHERE Id = Y;';
GO
