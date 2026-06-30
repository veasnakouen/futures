package com.mtp.report.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initialize() {
        String sql = "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ReportSettings' and xtype='U') " +
                "BEGIN " +
                "    CREATE TABLE ReportSettings ( " +
                "        id BIGINT IDENTITY(1,1) PRIMARY KEY, " +
                "        userId VARCHAR(255) NOT NULL, " +
                "        reportName VARCHAR(255) NOT NULL, " +
                "        preferences NVARCHAR(MAX) " +
                "    ) " +
                "END";
        jdbcTemplate.execute(sql);
    }
}
