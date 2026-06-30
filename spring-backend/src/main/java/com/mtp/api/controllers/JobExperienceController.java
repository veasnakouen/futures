package com.mtp.api.controllers;

import com.mtp.api.models.JobExperience;
import com.mtp.api.repositories.JobExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-experiences")
@CrossOrigin(origins = "*")
public class JobExperienceController {

    @Autowired
    private JobExperienceRepository repository;

    @GetMapping("/client/{clientId}")
    public List<JobExperience> getByClientId(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }

    @PostMapping
    public ResponseEntity<JobExperience> create(@RequestBody @NonNull JobExperience experience) {
        return ResponseEntity.ok(repository.save(experience));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobExperience> update(@PathVariable Integer id, @RequestBody @NonNull JobExperience details) {
        return repository.findById(id).map(existing -> {
            details.setId(id);
            return ResponseEntity.ok(repository.save(details));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return repository.findById(id).map((@NonNull JobExperience existing) -> {
            repository.delete(existing);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
