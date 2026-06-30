package com.mtp.report.services;

import com.mtp.report.models.ExternalDataSource;
import com.mtp.report.repositories.ExternalDataSourceRepository;
import com.opencsv.CSVReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStreamReader;
import java.util.*;

@Service
public class DataIntegrationService {

    @Autowired
    private ExternalDataSourceRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public ExternalDataSource saveJdbcConnection(String name, String jdbcUrl, String username, String password,
            String tableName, List<String> columns) throws Exception {
        ExternalDataSource source = new ExternalDataSource();
        source.setName(name);
        source.setType("JDBC");
        source.setJdbcUrl(jdbcUrl);
        source.setUsername(username);
        source.setPassword(password);
        source.setTableName(tableName);
        source.setColumnsJson(new ObjectMapper().writeValueAsString(columns));
        return repository.save(source);
    }

    public List<String> fetchJdbcTables(String jdbcUrl, String username, String password) throws Exception {
        org.springframework.jdbc.datasource.DriverManagerDataSource dataSource = new org.springframework.jdbc.datasource.DriverManagerDataSource();
        dataSource.setUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        if (jdbcUrl.contains("sqlserver"))
            dataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        else
            dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");

        List<String> tables = new ArrayList<>();
        try (java.sql.Connection conn = dataSource.getConnection()) {
            java.sql.DatabaseMetaData metaData = conn.getMetaData();
            try (java.sql.ResultSet rs = metaData.getTables(null, null, "%", new String[] { "TABLE", "VIEW" })) {
                while (rs.next()) {
                    tables.add(rs.getString("TABLE_NAME"));
                }
            }
        }
        Collections.sort(tables);
        return tables;
    }

    public List<String> fetchJdbcColumns(String jdbcUrl, String username, String password, String tableName) throws Exception {
        org.springframework.jdbc.datasource.DriverManagerDataSource dataSource = new org.springframework.jdbc.datasource.DriverManagerDataSource();
        dataSource.setUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        if (jdbcUrl.contains("sqlserver"))
            dataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        else
            dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");

        JdbcTemplate targetJdbcTemplate = new JdbcTemplate(dataSource);

        return targetJdbcTemplate.query("SELECT * FROM " + tableName + " WHERE 1=0", rs -> {
            java.sql.ResultSetMetaData rsmd = rs.getMetaData();
            int columnCount = rsmd.getColumnCount();
            List<String> columns = new ArrayList<>();
            for (int i = 1; i <= columnCount; i++) {
                columns.add(rsmd.getColumnName(i));
            }
            return columns;
        });
    }

    public ExternalDataSource processCsvUpload(String name, MultipartFile file) throws Exception {
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> lines = reader.readAll();
            if (lines.isEmpty())
                throw new IllegalArgumentException("CSV file is empty");

            String[] headers = lines.get(0);
            List<String> columnNames = new ArrayList<>();
            for (String h : headers) {
                // sanitize header names for SQL Server
                String safeHeader = h.replaceAll("[^a-zA-Z0-9_]", "");
                if (safeHeader.isEmpty())
                    safeHeader = "Col_" + UUID.randomUUID().toString().substring(0, 4);
                columnNames.add(safeHeader);
            }

            // Create a dynamic table in the main DB
            String tableName = "EXT_CSV_" + UUID.randomUUID().toString().replace("-", "");
            StringBuilder createTableSql = new StringBuilder("CREATE TABLE ").append(tableName).append(" (");
            for (int i = 0; i < columnNames.size(); i++) {
                createTableSql.append(columnNames.get(i)).append(" VARCHAR(MAX)");
                if (i < columnNames.size() - 1)
                    createTableSql.append(", ");
            }
            createTableSql.append(")");

            jdbcTemplate.execute(createTableSql.toString());

            // Insert data
            if (lines.size() > 1) {
                StringBuilder insertSql = new StringBuilder("INSERT INTO ").append(tableName).append(" VALUES (");
                for (int i = 0; i < columnNames.size(); i++) {
                    insertSql.append("?");
                    if (i < columnNames.size() - 1)
                        insertSql.append(", ");
                }
                insertSql.append(")");

                List<Object[]> batchArgs = new ArrayList<>();
                for (int i = 1; i < lines.size(); i++) {
                    String[] row = lines.get(i);
                    Object[] args = new Object[columnNames.size()];
                    for (int j = 0; j < columnNames.size(); j++) {
                        args[j] = j < row.length ? row[j] : null;
                    }
                    batchArgs.add(args);
                }
                jdbcTemplate.batchUpdate(insertSql.toString(), batchArgs);
            }

            // Save Metadata
            ExternalDataSource source = new ExternalDataSource();
            source.setName(name);
            source.setType("CSV");
            source.setTableName(tableName);
            source.setColumnsJson(new ObjectMapper().writeValueAsString(columnNames));
            return repository.save(source);
        }
    }

    public List<ExternalDataSource> getAllDataSources() {
        return repository.findAll();
    }
}
