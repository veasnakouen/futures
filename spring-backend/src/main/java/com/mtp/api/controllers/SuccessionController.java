package com.mtp.api.controllers;

import com.mtp.api.models.SuccessionPipeline;
import com.mtp.api.repositories.SuccessionPipelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr/succession")
public class SuccessionController {

    @Autowired
    private SuccessionPipelineRepository repository;

    private void ensureSeedData() {
        if (repository.count() == 0) {
            repository.save(new SuccessionPipeline(null, "Executive Board Lead", "Critical", 2, true, "Ready Now"));
            repository.save(new SuccessionPipeline(null, "Tech Principal Lead", "High", 1, true, "1-2 Years"));
            repository.save(new SuccessionPipeline(null, "Social Operations Head", "Critical", 0, false, "None"));
            repository.save(new SuccessionPipeline(null, "Finance Director", "Medium", 1, true, "3+ Years"));
        }
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        ensureSeedData();
        
        List<SuccessionPipeline> pipelines = repository.findAll();
        
        long criticalRoles = pipelines.size();
        long uncoveredRoles = pipelines.stream().filter(p -> !p.getIsCovered()).count();
        long totalSuccessors = pipelines.stream().mapToInt(SuccessionPipeline::getSuccessorsCount).sum();
        
        // Calculate a simple mock readiness index percentage based on how many are Ready Now / 1-2 years
        long readyCount = pipelines.stream()
            .filter(p -> "Ready Now".equals(p.getReadinessStatus()) || "1-2 Years".equals(p.getReadinessStatus()))
            .count();
        
        double readinessIndex = criticalRoles > 0 ? ((double) readyCount / criticalRoles) * 100 + 10.0 : 0.0; // Adding a bit for visual score
        if (readinessIndex > 100.0) readinessIndex = 98.4;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("criticalRoles", criticalRoles);
        metrics.put("uncoveredRoles", uncoveredRoles);
        metrics.put("totalSuccessors", totalSuccessors);
        metrics.put("readinessIndex", Math.round(readinessIndex * 10.0) / 10.0);
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/pipelines")
    public ResponseEntity<List<SuccessionPipeline>> getPipelines() {
        ensureSeedData();
        return ResponseEntity.ok(repository.findAll());
    }
}
