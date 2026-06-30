package com.mtp.api.services;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.mtp.api.models.SystemSetting;
import com.mtp.api.repositories.AuditLogRepository;
import com.mtp.api.repositories.SystemSettingRepository;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class DatabaseBackupService {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public String getSetting(String key, String defaultValue) {
        return systemSettingRepository.findById(key)
                .map(SystemSetting::getValue)
                .orElse(defaultValue);
    }

    public String extractDatabaseName(String url) {
        if (url == null) return "unknown";
        Pattern pattern = Pattern.compile("databaseName=([^;]+)");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "unknown";
    }

    public String runBackup(String type) throws Exception {
        if (!(dataSource instanceof HikariDataSource)) {
            throw new Exception("Dynamic backup is only supported for HikariDataSource");
        }

        HikariDataSource hikariDS = (HikariDataSource) dataSource;
        String currentUrl = hikariDS.getJdbcUrl();
        String dbName = extractDatabaseName(currentUrl);

        if ("unknown".equals(dbName)) {
            throw new Exception("Could not determine current database name.");
        }

        String basePath = getSetting("backup.path.local", "C:\\Backups");
        File backupDir = new File(basePath);
        if (!backupDir.exists()) {
            backupDir.mkdirs();
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = basePath + "\\" + dbName + "_" + type.toUpperCase() + "_" + timestamp + ".bak";

        String backupQuery;
        if ("differential".equalsIgnoreCase(type)) {
            backupQuery = "BACKUP DATABASE [" + dbName + "] TO DISK = '" + fileName + "' WITH DIFFERENTIAL, FORMAT, STATS = 10";
        } else {
            backupQuery = "BACKUP DATABASE [" + dbName + "] TO DISK = '" + fileName + "' WITH FORMAT, STATS = 10";
        }

        log.info("Executing database backup query: {}", backupQuery);
        jdbcTemplate.execute(backupQuery);
        
        log.info("Local backup saved successfully to {}", fileName);

        // Upload to S3 if enabled
        String cloudEnabledStr = getSetting("backup.cloud.s3.enabled", "false");
        boolean cloudEnabled = "true".equalsIgnoreCase(cloudEnabledStr) || "1".equals(cloudEnabledStr);

        if (cloudEnabled) {
            String accessKey = getSetting("backup.cloud.s3.accessKey", "");
            String secretKey = getSetting("backup.cloud.s3.secretKey", "");
            String region = getSetting("backup.cloud.s3.region", "us-east-1");
            String bucket = getSetting("backup.cloud.s3.bucket", "");

            if (accessKey.isEmpty() || secretKey.isEmpty() || bucket.isEmpty()) {
                throw new Exception("Cloud backup enabled but missing S3 credentials or bucket config.");
            }

            try {
                AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
                AmazonS3 s3client = AmazonS3ClientBuilder
                        .standard()
                        .withCredentials(new AWSStaticCredentialsProvider(credentials))
                        .withRegion(region)
                        .build();

                File fileToUpload = new File(fileName);
                String s3Key = "database-backups/" + fileToUpload.getName();
                
                log.info("Uploading backup to S3 bucket {} at key {}", bucket, s3Key);
                s3client.putObject(bucket, s3Key, fileToUpload);
                log.info("S3 Upload successful");
                
                fileName += " (and uploaded to S3: " + bucket + ")";
            } catch (Exception e) {
                log.error("S3 upload failed: ", e);
                throw new Exception("Local backup succeeded but S3 upload failed: " + e.getMessage());
            }
        }

        // Save Audit Log
        com.mtp.api.models.AuditLog backupLog = new com.mtp.api.models.AuditLog();
        backupLog.setLoggedUser("Admin_System_Auto");
        backupLog.setAction("Database Backup (" + type.toUpperCase() + ")");
        backupLog.setTarget(fileName);
        backupLog.setTimestamp(LocalDateTime.now());
        backupLog.setType("critical");
        auditLogRepository.save(backupLog);

        return fileName;
    }
}
