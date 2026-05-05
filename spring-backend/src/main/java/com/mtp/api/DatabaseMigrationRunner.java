package com.mtp.api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

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
            System.out.println("Database Migration failed (might already be applied or table not found): " + e.getMessage());
        }
    }
}
