package com.mtp.api.controllers;

import com.mtp.api.models.PlacementProgress;
import com.mtp.api.repositories.PlacementProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/placement-progress")

public class PlacementProgressController {
    @Autowired
    private PlacementProgressRepository repository;

    @GetMapping("/monitoring/{id}")
    public List<PlacementProgress> getByMonitoring(@PathVariable Integer id) {
        return repository.findByMonitoringId(id);
    }

    @PostMapping
    public PlacementProgress create(@RequestBody PlacementProgress progress) {
        return repository.save(progress);
    }
}
