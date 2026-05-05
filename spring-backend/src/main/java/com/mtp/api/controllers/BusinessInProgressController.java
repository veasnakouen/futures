package com.mtp.api.controllers;

import com.mtp.api.models.BusinessInProgress;
import com.mtp.api.repositories.BusinessInProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/business-in-progress")

public class BusinessInProgressController {
    @Autowired
    private BusinessInProgressRepository repository;

    @GetMapping("/monitoring/{id}")
    public List<BusinessInProgress> getByMonitoring(@PathVariable Integer id) {
        return repository.findByMonitoringId(id);
    }

    @PostMapping
    public BusinessInProgress create(@RequestBody BusinessInProgress progress) {
        return repository.save(progress);
    }
}
