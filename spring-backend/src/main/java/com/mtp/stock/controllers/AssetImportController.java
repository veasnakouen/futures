package com.mtp.stock.controllers;

import com.mtp.stock.services.AssetImportService;
import com.mtp.stock.dto.AssetImportDto;
import com.mtp.stock.dto.ImportSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock/assets/import")
@RequiredArgsConstructor
public class AssetImportController {

    private final AssetImportService importService;

    @GetMapping("/history")
    public ResponseEntity<List<ImportSummaryDto>> getImportHistory() {
        return ResponseEntity.ok(importService.getImportSummary());
    }

    @PostMapping("/async")
    public ResponseEntity<?> importExcelAsync(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }
        try {
            String jobId = importService.startImportAsync(file);
            return ResponseEntity.ok(Map.of("jobId", jobId));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error starting async job: " + e.getMessage()));
        }
    }

    @GetMapping("/progress/{jobId}")
    public ResponseEntity<?> getProgress(@PathVariable String jobId) {
        return ResponseEntity.ok(importService.getProgress(jobId));
    }

    @PostMapping
    public ResponseEntity<?> importExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }

        try {
            String jobId = importService.startImportAsync(file);
            return ResponseEntity.ok(Map.of(
                "message", "Successfully started Excel import",
                "jobId", jobId
            ));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error processing file: " + e.getMessage()));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<?> importBatch(@RequestBody List<AssetImportDto> items) {
        try {
            int count = importService.saveBatch(items);
            return ResponseEntity.ok(Map.of(
                "message", "Successfully imported batch",
                "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error processing batch: " + e.getMessage()));
        }
    }

    @PostMapping("/commit/{sheetName}")
    public ResponseEntity<?> commitImport(@PathVariable String sheetName) {
        int count = importService.commitBatch(sheetName);
        return ResponseEntity.ok(Map.of(
            "message", "Successfully committed " + count + " items to production database.",
            "count", count
        ));
    }

    @DeleteMapping("/clear/{model}")
    public ResponseEntity<?> clearData(@PathVariable String model) {
        if (model.equalsIgnoreCase("staging")) {
            importService.clearStagingTable();
            return ResponseEntity.ok(Map.of("message", "Staging data wiped successfully."));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid model target for clearing."));
    }
}
