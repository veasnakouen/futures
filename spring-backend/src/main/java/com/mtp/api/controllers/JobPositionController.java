package com.mtp.api.controllers;

import com.mtp.api.models.JobPosition;
import com.mtp.api.repositories.JobPositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/job-positions")

public class JobPositionController {
    @Autowired
    private JobPositionRepository repository;

    @GetMapping
    public List<JobPosition> getAll() {
        return repository.findByIsDeletedFalse();
    }

    @PostMapping
    public JobPosition create(@RequestBody JobPosition position) {
        return repository.save(position);
    }
}
