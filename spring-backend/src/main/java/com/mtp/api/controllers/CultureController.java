package com.mtp.api.controllers;

import com.mtp.api.models.Recognition;
import com.mtp.api.repositories.RecognitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr/culture")
public class CultureController {

    @Autowired
    private RecognitionRepository repository;

    private void ensureSeedData() {
        if (repository.count() == 0) {
            repository.save(new Recognition(null, "Admin", "Michael Jordan", "Exceptional Leadership during Q1 systems migration.", "Trailblazer", LocalDateTime.now().minusHours(2)));
            repository.save(new Recognition(null, "HR", "Sarah Jenkins", "Outstanding commitment to employee wellness initiatives.", "Culture Hero", LocalDateTime.now().minusDays(1)));
        }
    }

    @GetMapping("/recognitions")
    public ResponseEntity<List<Recognition>> getRecognitions() {
        ensureSeedData();
        // Sort descending by creation date in a real app
        List<Recognition> list = repository.findAll();
        list.sort((a,b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return ResponseEntity.ok(list);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        // Mocking dynamic sentiment tracking
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("sentimentScore", 4.8);
        metrics.put("sentimentMax", 5.0);
        metrics.put("moralePersistence", "Very High");
        metrics.put("moralePercentage", 92);
        
        List<Map<String, Object>> chartData = List.of(
            Map.of("month", "Jan", "score", 4.2),
            Map.of("month", "Feb", "score", 4.5),
            Map.of("month", "Mar", "score", 4.3),
            Map.of("month", "Apr", "score", 4.8)
        );
        metrics.put("chartData", chartData);
        
        List<Map<String, Object>> wellness = List.of(
            Map.of("label", "Step Challenge", "active", 45),
            Map.of("label", "Mental Health Days", "active", 12),
            Map.of("label", "Gym Subsidy", "active", 88)
        );
        metrics.put("wellnessTrack", wellness);

        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/recognitions")
    public ResponseEntity<Recognition> postRecognition(@RequestBody Recognition recognition) {
        recognition.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(repository.save(recognition));
    }
}
