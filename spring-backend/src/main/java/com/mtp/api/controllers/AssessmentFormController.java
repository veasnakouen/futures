package com.mtp.api.controllers;

import com.mtp.api.models.AssessmentForm;
import com.mtp.api.repositories.AssessmentFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentFormController {

    @Autowired
    private AssessmentFormRepository repository;

    @GetMapping
    public List<AssessmentForm> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentForm> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ticket/{ticketId}")
    public List<AssessmentForm> getByTicketId(@PathVariable String ticketId) {
        return repository.findByTicketId(ticketId);
    }

    @PostMapping
    public AssessmentForm create(@RequestBody AssessmentForm assessment) {
        if (assessment.getAssessmentDate() == null) {
            assessment.setAssessmentDate(LocalDate.now());
        }
        // Ensure bidirectional linkage for items
        if (assessment.getItems() != null) {
            assessment.getItems().forEach(item -> item.setAssessmentForm(assessment));
        }
        return repository.save(assessment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssessmentForm> update(@PathVariable Long id, @RequestBody AssessmentForm updatedAssessment) {
        return repository.findById(id).map(assessment -> {
            assessment.setBrand(updatedAssessment.getBrand());
            assessment.setModel(updatedAssessment.getModel());
            assessment.setItemCode(updatedAssessment.getItemCode());
            assessment.setSubject(updatedAssessment.getSubject());
            assessment.setIssueDescription(updatedAssessment.getIssueDescription());
            
            assessment.getItems().clear();
            if (updatedAssessment.getItems() != null) {
                updatedAssessment.getItems().forEach(item -> {
                    item.setAssessmentForm(assessment);
                    assessment.getItems().add(item);
                });
            }
            
            return ResponseEntity.ok(repository.save(assessment));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return repository.findById(id).map(a -> {
            repository.delete(a);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
