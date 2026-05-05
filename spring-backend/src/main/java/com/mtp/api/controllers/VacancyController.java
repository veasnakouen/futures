package com.mtp.api.controllers;

import com.mtp.api.dto.VacancyDto;
import com.mtp.api.services.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/vacancies")
public class VacancyController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public Page<VacancyDto> getAllVacancies(Pageable pageable) {
        return jobService.getAllVacancies(pageable);
    }

    @PostMapping
    public VacancyDto createVacancy(@RequestBody VacancyDto vacancy) {
        return jobService.saveVacancy(vacancy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacancyDto> updateVacancy(@PathVariable Integer id, @RequestBody VacancyDto details) {
        details.setId(id);
        return ResponseEntity.ok(jobService.saveVacancy(details));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVacancy(@PathVariable Integer id) {
        jobService.deleteVacancy(id);
        return ResponseEntity.ok().build();
    }
}

