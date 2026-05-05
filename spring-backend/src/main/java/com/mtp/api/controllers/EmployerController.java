package com.mtp.api.controllers;

import com.mtp.api.dto.EmployerDto;
import com.mtp.api.services.JobService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/employers")
@Slf4j
public class EmployerController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public Page<EmployerDto> getAllEmployers(Pageable pageable) {
        return jobService.getAllEmployers(pageable);
    }

    @PostMapping
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public EmployerDto createEmployer(@Valid @RequestBody EmployerDto employer) {
        log.info("Creating employer: {}", employer.getName());
        EmployerDto saved = jobService.saveEmployer(employer);
        log.info("Employer created with ID: {}", saved.getId());
        return saved;
    }

    @PutMapping("/{id}")
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmployerDto> updateEmployer(@PathVariable Integer id, @Valid @RequestBody EmployerDto details) {
        log.info("Updating employer ID: {}", id);
        details.setId(id);
        return ResponseEntity.ok(jobService.saveEmployer(details));
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Void> deleteEmployer(@PathVariable Integer id) {
        log.warn("Deleting employer ID: {}", id);
        jobService.deleteEmployer(id);
        return ResponseEntity.ok().build();
    }
}
