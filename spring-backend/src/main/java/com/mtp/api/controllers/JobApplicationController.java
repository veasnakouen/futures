package com.mtp.api.controllers;

import com.mtp.api.dto.JobApplicationDto;
import com.mtp.api.services.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-applications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<JobApplicationDto> createApplication(@RequestBody JobApplicationDto dto) {
        return ResponseEntity.ok(jobApplicationService.createApplication(dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplicationDto> updateStatus(@PathVariable Integer id, @RequestBody java.util.Map<String, String> body) {
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(id, body.get("status")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDto> getApplicationById(@PathVariable Integer id) {
        return ResponseEntity.ok(jobApplicationService.getApplicationById(id));
    }

    @GetMapping("/vacancy/{vacancyId}")
    public ResponseEntity<Page<JobApplicationDto>> getByVacancyId(
            @PathVariable Integer vacancyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByVacancyId(vacancyId, PageRequest.of(page, size)));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<Page<JobApplicationDto>> getByClientId(
            @PathVariable Integer clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByClientId(clientId, PageRequest.of(page, size)));
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<Page<JobApplicationDto>> getByEmployerId(
            @PathVariable Integer employerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByEmployerId(employerId, PageRequest.of(page, size)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Integer id) {
        jobApplicationService.deleteApplication(id);
        return ResponseEntity.ok().build();
    }
}
