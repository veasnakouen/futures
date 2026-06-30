package com.mtp.api;

import com.mtp.api.models.ExpectedSupportOption;
import com.mtp.api.models.SystemSetting;
import com.mtp.api.repositories.ExpectedSupportOptionRepository;
import com.mtp.api.repositories.SystemSettingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrationRunner.class);

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private ExpectedSupportOptionRepository expectedSupportOptionRepository;

    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Running Database Migration: Altering SupportTickets columns to nvarchar(450)");

            // Drop constraint if exists just in case (optional, we'll try without it first)

            jdbcTemplate.execute("ALTER TABLE SupportTickets ALTER COLUMN ReporterId nvarchar(450)");
            jdbcTemplate.execute("ALTER TABLE SupportTickets ALTER COLUMN AssigneeId nvarchar(450)");

            System.out.println("Database Migration executed successfully.");
        } catch (Exception e) {
            System.out.println(
                    "Database Migration failed (might already be applied or table not found): " + e.getMessage());
        }

        try {
            System.out.println(
                    "Running Database Migration: Adding/Altering imageUrl column in CompanyAssets to varchar(max)");
            try {
                jdbcTemplate.execute("ALTER TABLE CompanyAssets ADD imageUrl varchar(max) NULL");
            } catch (Exception addEx) {
                jdbcTemplate.execute("ALTER TABLE CompanyAssets ALTER COLUMN imageUrl varchar(max) NULL");
            }
            System.out.println("CompanyAssets imageUrl Migration executed successfully.");
        } catch (Exception e) {
            System.out.println("CompanyAssets imageUrl Migration details: " + e.getMessage());
        }

        try {
            System.out.println("Running Database Migration: Adding assignedDate column to CompanyAssets");
            jdbcTemplate.execute("ALTER TABLE CompanyAssets ADD assignedDate datetime2 NULL");
            System.out.println("CompanyAssets assignedDate Migration executed successfully.");
        } catch (Exception e) {
            System.out.println("CompanyAssets assignedDate Migration details (could mean column already exists): "
                    + e.getMessage());
        }

        try {
            System.out.println("Running Database Migration: Adding createdAt column to CompanyAssets");
            jdbcTemplate.execute("ALTER TABLE CompanyAssets ADD createdAt datetime2 NULL");
            System.out.println("CompanyAssets createdAt Migration executed successfully.");
        } catch (Exception e) {
            System.out.println(
                    "CompanyAssets createdAt Migration details (could mean column already exists): " + e.getMessage());
        }

        if (systemSettingRepository.count() == 0) {
            systemSettingRepository.save(new SystemSetting("organizationName", "M'Lop Tapang"));
            systemSettingRepository.save(new SystemSetting("defaultLanguage", "en"));
            systemSettingRepository.save(new SystemSetting("theme", "light"));
            systemSettingRepository.save(new SystemSetting("timezone", "Asia/Phnom_Penh"));
            log.info("Seeded default system settings");
        }

        if (expectedSupportOptionRepository.count() == 0) {
            expectedSupportOptionRepository
                    .save(new ExpectedSupportOption(null, "Further Education (Meeting with social worker)"));
            expectedSupportOptionRepository.save(new ExpectedSupportOption(null, "Placement (Skills assessment)"));
            expectedSupportOptionRepository.save(new ExpectedSupportOption(null, "Futures Training"));
            expectedSupportOptionRepository.save(new ExpectedSupportOption(null, "Social Support"));
            log.info("Seeded default expected support options");
        }

        try {
            System.out.println("Running Database Migration: Seeding PlacementCategories");
            Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM PlacementCategories", Long.class);
            if (count != null && count == 0) {
                jdbcTemplate.update("INSERT INTO PlacementCategories (name) VALUES ('Employment')");
                jdbcTemplate.update("INSERT INTO PlacementCategories (name) VALUES ('Internship')");
                jdbcTemplate.update("INSERT INTO PlacementCategories (name) VALUES ('Vocational Training')");
                System.out.println("Seeded PlacementCategories successfully.");
            }
        } catch (Exception e) {
            System.out.println("PlacementCategories Seeding details (table might not exist yet): " + e.getMessage());
        }

        try {
            System.out.println("Running Database Migration: Adding biometric fields to Employees");
            try {
                jdbcTemplate.execute("ALTER TABLE Employees ADD biometricStatus nvarchar(255) NULL");
            } catch (Exception ex) {
            }
            try {
                jdbcTemplate.execute("ALTER TABLE Employees ADD biometricId nvarchar(255) NULL");
            } catch (Exception ex) {
            }
            System.out.println("Employees biometric columns migration completed.");
        } catch (Exception e) {
            System.out.println("Employees biometric columns migration details: " + e.getMessage());
        }

    }
}
