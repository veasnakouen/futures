package com.mtp.stock.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@Configuration
public class DataMigrationConfig {

    @Bean
    public CommandLineRunner migrateCategories(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                System.out.println("Checking columns in InventoryItems...");
                List<Map<String, Object>> sample = jdbcTemplate.queryForList("SELECT TOP 1 * FROM InventoryItems");
                if (!sample.isEmpty()) {
                    System.out.println("Columns in InventoryItems: " + sample.get(0).keySet());
                }

                // Try to find the exact name of the category column
                String categoryColName = null;
                if (!sample.isEmpty()) {
                    for (String key : sample.get(0).keySet()) {
                        if (key.equalsIgnoreCase("category") || key.equalsIgnoreCase("Category")) {
                            categoryColName = key;
                            break;
                        }
                    }
                }

                if (categoryColName == null) {
                    System.out.println("No 'category' column found. Checking if there are legacy categories to migrate...");
                    return;
                }

                System.out.println("Found category column: " + categoryColName);

                List<Map<String, Object>> itemsWithLegacyCategory = jdbcTemplate.queryForList(
                        "SELECT id, " + categoryColName + " as category FROM InventoryItems WHERE " + categoryColName + " IS NOT NULL AND " + categoryColName + " != '' AND category_id IS NULL");
                
                if (itemsWithLegacyCategory.isEmpty()) {
                    System.out.println("No legacy categories to migrate.");
                    return;
                }

                System.out.println("Starting legacy category migration for " + itemsWithLegacyCategory.size() + " items...");

                for (Map<String, Object> item : itemsWithLegacyCategory) {
                    Long itemId = ((Number) item.get("id")).longValue();
                    String categoryName = (String) item.get("category");

                    // Check if category exists
                    List<Map<String, Object>> existingCat = jdbcTemplate.queryForList(
                            "SELECT id FROM AssetCategories WHERE LOWER(name) = LOWER(?)", categoryName);

                    Long categoryId;
                    if (existingCat.isEmpty()) {
                        System.out.println("Creating new category: " + categoryName);
                        // Using explicit column names to avoid issues, including timestamps since they are not nullable if they have default, but better explicit
                        jdbcTemplate.update("INSERT INTO AssetCategories (name, CreatedAt) VALUES (?, GETDATE())", categoryName);
                        categoryId = jdbcTemplate.queryForObject("SELECT id FROM AssetCategories WHERE LOWER(name) = LOWER(?)", Long.class, categoryName);
                    } else {
                        categoryId = ((Number) existingCat.get(0).get("id")).longValue();
                    }

                    // Update item with new category_id
                    jdbcTemplate.update("UPDATE InventoryItems SET category_id = ? WHERE id = ?", categoryId, itemId);
                    System.out.println("Migrated item " + itemId + " to category_id " + categoryId);
                }

                System.out.println("Migration complete!");
            } catch (Exception e) {
                System.err.println("Migration skipped or failed: " + e.getMessage());
            }
        };
    }
}
