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
                try {
                    jdbcTemplate.update("UPDATE AssetCategories SET prefixCode = NULL WHERE prefixCode = '' OR LTRIM(RTRIM(prefixCode)) = ''");
                } catch (Exception ignored) {}

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

    @Bean
    public CommandLineRunner seedCompanyAssets(com.mtp.stock.repositories.AssetRepository assetRepository) {
        return args -> {
            try {
                if (assetRepository.count() == 0) {
                    System.out.println("No company assets found in database. Seeding initial enterprise assets...");
                    
                    com.mtp.stock.models.CompanyAsset a1 = new com.mtp.stock.models.CompanyAsset();
                    a1.setName("MacBook Pro 16\" M3 Max");
                    a1.setSerialNumber("MBP-2024-8841");
                    a1.setAssetType("Laptop");
                    a1.setStatus("Assigned");
                    a1.setImageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60");
                    a1.setVendor("Apple Authorized Enterprise");
                    a1.setPurchaseDate(java.time.LocalDate.of(2024, 1, 15));
                    a1.setPurchaseCost(3499.00);
                    a1.setWarrantyExpiryDate(java.time.LocalDate.of(2027, 1, 15));
                    a1.setAssetCondition("Excellent");
                    a1.setBarcode("BC-8841-M3");
                    a1.setLocation("Main HQ - Tech Room 302");
                    a1.setIsReturnable(true);
                    a1.setIsKit(false);
                    a1.setIsActive(true);
                    a1.setBrand("Apple");
                    a1.setModelNumber("A2991");
                    
                    com.mtp.stock.models.CompanyAsset a2 = new com.mtp.stock.models.CompanyAsset();
                    a2.setName("Dell UltraSharp 32\" 4K USB-C Hub Monitor");
                    a2.setSerialNumber("DEL-U3223QE-992");
                    a2.setAssetType("Monitor");
                    a2.setStatus("Assigned");
                    a2.setImageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60");
                    a2.setVendor("Dell Authorized Distributor");
                    a2.setPurchaseDate(java.time.LocalDate.of(2024, 2, 10));
                    a2.setPurchaseCost(899.00);
                    a2.setWarrantyExpiryDate(java.time.LocalDate.of(2027, 2, 10));
                    a2.setAssetCondition("Good");
                    a2.setBarcode("BC-3223-DEL");
                    a2.setLocation("Main HQ - Workstation A12");
                    a2.setIsReturnable(true);
                    a2.setIsActive(true);
                    a2.setBrand("Dell");
                    a2.setModelNumber("U3223QE");

                    com.mtp.stock.models.CompanyAsset a3 = new com.mtp.stock.models.CompanyAsset();
                    a3.setName("Lenovo ThinkPad X1 Carbon Gen 11");
                    a3.setSerialNumber("TP-X1C11-4029");
                    a3.setAssetType("Laptop");
                    a3.setStatus("Available");
                    a3.setImageUrl("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60");
                    a3.setVendor("Lenovo Direct Enterprise");
                    a3.setPurchaseDate(java.time.LocalDate.of(2024, 3, 1));
                    a3.setPurchaseCost(1850.00);
                    a3.setWarrantyExpiryDate(java.time.LocalDate.of(2026, 3, 1));
                    a3.setAssetCondition("New");
                    a3.setBarcode("BC-X1C11-40");
                    a3.setLocation("IT Storage - Shelf B4");
                    a3.setIsReturnable(true);
                    a3.setIsActive(true);
                    a3.setBrand("Lenovo");
                    a3.setModelNumber("21HM001QUS");

                    com.mtp.stock.models.CompanyAsset a4 = new com.mtp.stock.models.CompanyAsset();
                    a4.setName("Cisco Meraki MX95 Enterprise Security Appliance");
                    a4.setSerialNumber("CSCO-MX95-8812");
                    a4.setAssetType("Server");
                    a4.setStatus("Assigned");
                    a4.setImageUrl("https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60");
                    a4.setVendor("Cisco Systems");
                    a4.setPurchaseDate(java.time.LocalDate.of(2023, 11, 20));
                    a4.setPurchaseCost(4200.00);
                    a4.setWarrantyExpiryDate(java.time.LocalDate.of(2028, 11, 20));
                    a4.setAssetCondition("Excellent");
                    a4.setBarcode("BC-MX95-CISCO");
                    a4.setLocation("Server Room DC-1");
                    a4.setIsReturnable(false);
                    a4.setIsActive(true);
                    a4.setBrand("Cisco Meraki");
                    a4.setModelNumber("MX95-HW");

                    com.mtp.stock.models.CompanyAsset a5 = new com.mtp.stock.models.CompanyAsset();
                    a5.setName("iPad Pro 12.9\" M2 Wi-Fi + Cellular 256GB");
                    a5.setSerialNumber("IPD-M2-129-5510");
                    a5.setAssetType("Mobile");
                    a5.setStatus("Available");
                    a5.setImageUrl("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60");
                    a5.setVendor("Smart Axiata Business");
                    a5.setPurchaseDate(java.time.LocalDate.of(2024, 4, 5));
                    a5.setPurchaseCost(1299.00);
                    a5.setWarrantyExpiryDate(java.time.LocalDate.of(2025, 4, 5));
                    a5.setAssetCondition("New");
                    a5.setBarcode("BC-IPD129-M2");
                    a5.setLocation("IT Storage - Vault 2");
                    a5.setIsReturnable(true);
                    a5.setIsActive(true);
                    a5.setBrand("Apple");
                    a5.setModelNumber("MP623LL/A");

                    com.mtp.stock.models.CompanyAsset a6 = new com.mtp.stock.models.CompanyAsset();
                    a6.setName("Logitech MX Master 3S + Mechanical Wireless Combo");
                    a6.setSerialNumber("LOG-MX3S-9912");
                    a6.setAssetType("Peripherals");
                    a6.setStatus("Assigned");
                    a6.setImageUrl("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60");
                    a6.setVendor("Logitech Official");
                    a6.setPurchaseDate(java.time.LocalDate.of(2024, 5, 12));
                    a6.setPurchaseCost(249.00);
                    a6.setWarrantyExpiryDate(java.time.LocalDate.of(2026, 5, 12));
                    a6.setAssetCondition("Good");
                    a6.setBarcode("BC-MX3S-LOGI");
                    a6.setLocation("Main HQ - Workstation C08");
                    a6.setIsReturnable(true);
                    a6.setIsActive(true);
                    a6.setBrand("Logitech");
                    a6.setModelNumber("910-006556");

                    assetRepository.saveAll(java.util.Arrays.asList(a1, a2, a3, a4, a5, a6));
                    System.out.println("Seeded initial company assets into database successfully.");
                }
            } catch (Exception e) {
                System.err.println("Could not seed company assets: " + e.getMessage());
            }
        };
    }
}
