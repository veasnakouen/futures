package com.mtp.api.controllers;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import com.mtp.api.services.DatabaseBackupService;
import com.mtp.api.models.SystemSetting;
import com.mtp.api.repositories.SystemSettingRepository;

import javax.sql.DataSource;
import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/admin/database")
@PreAuthorize("hasAuthority('SYSTEM_CONFIG')")
@Slf4j
public class DatabaseManagementController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private com.mtp.api.repositories.AuditLogRepository auditLogRepository;

    @Autowired
    private DatabaseBackupService databaseBackupService;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentDatabase() {
        try {
            if (dataSource instanceof HikariDataSource) {
                HikariDataSource hikariDS = (HikariDataSource) dataSource;
                String jdbcUrl = hikariDS.getJdbcUrl();

                String dbName = extractDatabaseName(jdbcUrl);

                Map<String, Object> info = new HashMap<>();
                info.put("currentDb", dbName);
                info.put("jdbcUrl", jdbcUrl);
                info.put("poolName", hikariDS.getPoolName());
                return ResponseEntity.ok(info);
            }
            return ResponseEntity.badRequest().body("Datasource is not a HikariDataSource instance");
        } catch (Exception e) {
            log.error("Failed to get database info: ", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/switch")
    public ResponseEntity<?> switchDatabase(@RequestBody Map<String, String> payload) {
        String dbName = payload.get("databaseName");
        if (dbName == null || dbName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Database name is required");
        }

        // Sanitize database name (SQL Server database names can have letters, digits,
        // and underscores)
        if (!dbName.matches("^[a-zA-Z0-9_\\-]+$")) {
            return ResponseEntity.badRequest().body("Invalid database name format");
        }

        if (!(dataSource instanceof HikariDataSource)) {
            return ResponseEntity.badRequest().body("Dynamic switching is only supported for HikariDataSource");
        }

        try {
            HikariDataSource hikariDS = (HikariDataSource) dataSource;
            String currentUrl = hikariDS.getJdbcUrl();
            String newUrl = currentUrl.replaceAll("databaseName=[^;]+", "databaseName=" + dbName);

            log.info("Testing connection to database: {} at URL: {}", dbName, newUrl);

            // Test connection first
            try (Connection conn = DriverManager.getConnection(newUrl, username, password)) {
                log.info("Connection test succeeded for database: {}", dbName);
            } catch (Exception connEx) {
                log.warn("Failed to connect to database: {} - Error: {}", dbName, connEx.getMessage());
                return ResponseEntity.badRequest().body("Database connection failed: " + connEx.getMessage());
            }

            // Perform switch
            hikariDS.setJdbcUrl(newUrl);
            hikariDS.getHikariPoolMXBean().softEvictConnections();
            log.info("Successfully switched connection pool JDBC URL to: {}", newUrl);

            // Evict all caches
            if (cacheManager != null) {
                cacheManager.getCacheNames().forEach(cacheName -> {
                    if (cacheManager.getCache(cacheName) != null) {
                        cacheManager.getCache(cacheName).clear();
                    }
                });
                log.info("Cleared all caches after database switch");
            }

            // Save Audit Log
            com.mtp.api.models.AuditLog switchLog = new com.mtp.api.models.AuditLog();
            switchLog.setLoggedUser("Admin_System");
            switchLog.setAction("Database Switch");
            switchLog.setTarget(dbName);
            switchLog.setTimestamp(java.time.LocalDateTime.now());
            switchLog.setType("critical");
            auditLogRepository.save(switchLog);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("newDb", dbName);
            response.put("message", "Database successfully switched to " + dbName);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to switch database: ", e);
            return ResponseEntity.internalServerError().body("Failed to switch database: " + e.getMessage());
        }
    }

    private String extractDatabaseName(String url) {
        if (url == null)
            return "unknown";
        Pattern pattern = Pattern.compile("databaseName=([^;]+)");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "unknown";
    }

    @GetMapping("/backup-settings")
    public ResponseEntity<?> getBackupSettings() {
        Map<String, String> settings = new HashMap<>();
        settings.put("backupPathLocal", databaseBackupService.getSetting("backup.path.local", "C:\\Backups"));
        settings.put("backupCloudEnabled", databaseBackupService.getSetting("backup.cloud.s3.enabled", "false"));
        settings.put("backupCloudAccessKey", databaseBackupService.getSetting("backup.cloud.s3.accessKey", ""));
        settings.put("backupCloudSecretKey", databaseBackupService.getSetting("backup.cloud.s3.secretKey", ""));
        settings.put("backupCloudRegion", databaseBackupService.getSetting("backup.cloud.s3.region", "us-east-1"));
        settings.put("backupCloudBucket", databaseBackupService.getSetting("backup.cloud.s3.bucket", ""));
        settings.put("backupScheduleEnabled", databaseBackupService.getSetting("backup.schedule.enabled", "false"));
        settings.put("backupScheduleCron", databaseBackupService.getSetting("backup.schedule.cron", "0 0 0 * * ?"));
        settings.put("backupScheduleType", databaseBackupService.getSetting("backup.schedule.type", "full"));
        return ResponseEntity.ok(settings);
    }

    @PostMapping("/backup-settings")
    public ResponseEntity<?> saveBackupSettings(@RequestBody Map<String, String> payload) {
        payload.forEach((key, value) -> {
            String dbKey = switch (key) {
                case "backupPathLocal" -> "backup.path.local";
                case "backupCloudEnabled" -> "backup.cloud.s3.enabled";
                case "backupCloudAccessKey" -> "backup.cloud.s3.accessKey";
                case "backupCloudSecretKey" -> "backup.cloud.s3.secretKey";
                case "backupCloudRegion" -> "backup.cloud.s3.region";
                case "backupCloudBucket" -> "backup.cloud.s3.bucket";
                case "backupScheduleEnabled" -> "backup.schedule.enabled";
                case "backupScheduleCron" -> "backup.schedule.cron";
                case "backupScheduleType" -> "backup.schedule.type";
                default -> null;
            };
            if (dbKey != null) {
                SystemSetting setting = new SystemSetting(dbKey, value);
                systemSettingRepository.save(setting);
            }
        });
        return ResponseEntity.ok(Map.of("status", "success", "message", "Backup settings saved successfully."));
    }

    @PostMapping("/backup")
    public ResponseEntity<?> backupDatabase(@RequestBody Map<String, String> payload) {
        String type = payload.getOrDefault("type", "full").toLowerCase();
        
        try {
            String fileName = databaseBackupService.runBackup(type);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Database backup successful");
            response.put("file", fileName);
            response.put("type", type);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to backup database: ", e);
            return ResponseEntity.internalServerError().body("Failed to backup database: " + e.getMessage());
        }
    }
}
