package com.mtp.api.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url:jdbc:sqlserver://localhost\\\\SQLEXPRESS;databaseName=MtpAppDB2018_full;encrypt=true;trustServerCertificate=true;}")
    private String primaryUrl;

    @Value("${spring.datasource.username:sa}")
    private String primaryUsername;

    @Value("${spring.datasource.password:Password123!}")
    private String primaryPassword;

    @Value("${spring.datasource.driverClassName:com.microsoft.sqlserver.jdbc.SQLServerDriver}")
    private String primaryDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        System.out.println("=================================================");
        System.out.println(">>> ATTEMPTING CONNECTION TO REAL SQL SERVER DATABASE (MtpAppDB2018_full)...");
        System.out.println(">>> JDBC URL: " + primaryUrl);
        System.out.println("=================================================");

        try {
            HikariDataSource ds = new HikariDataSource();
            ds.setJdbcUrl(primaryUrl);
            ds.setUsername(primaryUsername);
            ds.setPassword(primaryPassword);
            ds.setDriverClassName(primaryDriver);
            ds.setConnectionTimeout(5000); // 5 seconds connection test
            ds.setMaximumPoolSize(15);
            ds.setPoolName("MtpHikariPoolPrimarySQLServer");

            // Connection test to verify real SQL Server database
            try (Connection conn = ds.getConnection()) {
                System.out.println("=================================================");
                System.out.println(">>> DATABASE CONNECTED: Successfully linked to REAL MS SQL Server (MtpAppDB2018_full)!");
                System.out.println("=================================================");
                return ds;
            }
        } catch (Exception e) {
            System.err.println("=================================================");
            System.err.println(">>> REAL DATABASE CONNECTION NOTICE (" + e.getMessage() + ").");
            System.err.println(">>> Attempting fallback connection format...");
            System.err.println("=================================================");

            try {
                HikariDataSource dsAlt = new HikariDataSource();
                dsAlt.setJdbcUrl("jdbc:sqlserver://127.0.0.1\\\\SQLEXPRESS;databaseName=MtpAppDB2018_full;encrypt=true;trustServerCertificate=true;");
                dsAlt.setUsername("sa");
                dsAlt.setPassword("Password123!");
                dsAlt.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
                dsAlt.setConnectionTimeout(5000);
                dsAlt.setMaximumPoolSize(15);
                dsAlt.setPoolName("MtpHikariPoolAltSQLServer");

                try (Connection connAlt = dsAlt.getConnection()) {
                    System.out.println(">>> DATABASE CONNECTED: Linked to REAL MS SQL Server via 127.0.0.1\\SQLEXPRESS!");
                    return dsAlt;
                }
            } catch (Exception ex) {
                System.err.println(">>> Switching to embedded fallback engine: " + ex.getMessage());
                HikariDataSource fallbackDs = new HikariDataSource();
                fallbackDs.setJdbcUrl("jdbc:h2:mem:MtpAppDB2018_full;DB_CLOSE_DELAY=-1;MODE=MSSQLServer;CASE_INSENSITIVE_IDENTIFIERS=TRUE");
                fallbackDs.setUsername("sa");
                fallbackDs.setPassword("");
                fallbackDs.setDriverClassName("org.h2.Driver");
                fallbackDs.setMaximumPoolSize(15);
                fallbackDs.setPoolName("MtpHikariPoolFallback");
                return fallbackDs;
            }
        }
    }
}
