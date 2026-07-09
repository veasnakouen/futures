package com.mtp.api.controllers;

import com.mtp.api.dto.VacancyDto;
import com.mtp.api.services.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/vacancies")
public class VacancyController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public Page<VacancyDto> getAllVacancies(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        return jobService.getAllVacancies(pageable, search);
    }

    @GetMapping("/public")
    public Page<VacancyDto> getPublicVacancies(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        return jobService.getPublicVacancies(pageable, search);
    }

    @GetMapping("/public/{id}")
    @Cacheable(value = "public_vacancy", key = "#id")
    public ResponseEntity<VacancyDto> getPublicVacancyById(@PathVariable Integer id) {
        return ResponseEntity.ok(jobService.getVacancyById(id));
    }

    @PostMapping
    @CacheEvict(value = {"dashboardStats", "vacancies"}, allEntries = true)
    public VacancyDto createVacancy(@Valid @RequestBody VacancyDto vacancy) {
        return jobService.saveVacancy(vacancy);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = {"dashboardStats", "vacancies"}, allEntries = true)
    public ResponseEntity<VacancyDto> updateVacancy(@PathVariable Integer id, @Valid @RequestBody VacancyDto details) {
        details.setId(id);
        return ResponseEntity.ok(jobService.saveVacancy(details));
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = {"dashboardStats", "vacancies"}, allEntries = true)
    public ResponseEntity<Void> deleteVacancy(@PathVariable Integer id) {
        jobService.deleteVacancy(id);
        return ResponseEntity.ok().build();
    }
}

