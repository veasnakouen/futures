package com.mtp.clinic.controllers;

import com.mtp.clinic.models.DiagnosisTemplate;
import com.mtp.clinic.repositories.DiagnosisTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clinic/diagnosis-templates")
@RequiredArgsConstructor
public class DiagnosisTemplateController {

    private final DiagnosisTemplateRepository repository;

    @GetMapping
    public Page<DiagnosisTemplate> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @PostMapping
    public DiagnosisTemplate create(@RequestBody DiagnosisTemplate template) {
        return repository.save(template);
    }
}
