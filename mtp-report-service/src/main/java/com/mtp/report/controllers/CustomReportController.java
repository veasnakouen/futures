package com.mtp.report.controllers;

import com.mtp.report.services.DynamicQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/custom-reports")
public class CustomReportController {
    @Autowired
    private DynamicQueryService dynamicQueryService;

    @GetMapping("/metadata")
    public ResponseEntity<?> getMetadata() {
        try {
            return ResponseEntity.ok(dynamicQueryService.getMetadata());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
    @PostMapping("/preview")
    public ResponseEntity<?> previewReport(@RequestBody Map<String, Object> queryPayload) {
        try {
            Map<String, Object> result = dynamicQueryService.executePreviewQuery(queryPayload);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to generate preview: " + e.getMessage()));
        }
    }
}
