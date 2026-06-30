package com.mtp.api.controllers;

import com.mtp.api.models.JobExpectation;
import com.mtp.api.repositories.JobExpectationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-expectations")
@CrossOrigin(origins = "*")
public class JobExpectationController {

    @Autowired
    private JobExpectationRepository jobExpectationRepository;

    @GetMapping("/client/{clientId}")
    public List<JobExpectation> getByClientId(@PathVariable Integer clientId) {
        return jobExpectationRepository.findByClientId(clientId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody JobExpectation jobExpectation) {
        return ResponseEntity.ok(jobExpectationRepository.save(jobExpectation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody JobExpectation jobExpectation) {
        return jobExpectationRepository.findById(id).map(existing -> {
            jobExpectation.setId(id);
            return ResponseEntity.ok(jobExpectationRepository.save(jobExpectation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return jobExpectationRepository.findById(id).map(existing -> {
            jobExpectationRepository.delete(existing);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
