package com.mtp.report.controllers;

import com.mtp.report.models.ExternalDataSource;
import com.mtp.report.services.DataIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report-builder/data-integration")
public class DataIntegrationController {

    @Autowired
    private DataIntegrationService service;

    @PostMapping("/upload-csv")
    public ResponseEntity<?> uploadCsv(@RequestParam("name") String name, @RequestParam("file") MultipartFile file) {
        try {
            ExternalDataSource source = service.processCsvUpload(name, file);
            return ResponseEntity.ok(source);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/external-jdbc")
    public ResponseEntity<?> connectJdbc(@RequestBody Map<String, Object> payload) {
        try {
            String name = (String) payload.get("name");
            String url = (String) payload.get("jdbcUrl");
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");
            String table = (String) payload.get("tableName");
            List<String> columns = (List<String>) payload.get("columns");

            ExternalDataSource source = service.saveJdbcConnection(name, url, username, password, table, columns);
            return ResponseEntity.ok(source);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/fetch-tables")
    public ResponseEntity<?> fetchTables(@RequestBody Map<String, Object> payload) {
        try {
            String url = (String) payload.get("jdbcUrl");
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");

            List<String> tables = service.fetchJdbcTables(url, username, password);
            return ResponseEntity.ok(tables);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to connect and fetch tables: " + e.getMessage()));
        }
    }

    @PostMapping("/fetch-columns")
    public ResponseEntity<?> fetchColumns(@RequestBody Map<String, Object> payload) {
        try {
            String url = (String) payload.get("jdbcUrl");
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");
            String table = (String) payload.get("tableName");

            List<String> columns = service.fetchJdbcColumns(url, username, password, table);
            return ResponseEntity.ok(columns);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to connect and fetch columns: " + e.getMessage()));
        }
    }

    @GetMapping("/sources")
    public ResponseEntity<List<ExternalDataSource>> getAllSources() {
        return ResponseEntity.ok(service.getAllDataSources());
    }
}
