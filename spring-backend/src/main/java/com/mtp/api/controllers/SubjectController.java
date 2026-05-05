package com.mtp.api.controllers;

import com.mtp.api.dto.SubjectDto;
import com.mtp.api.services.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")

public class SubjectController {
    @Autowired
    private EducationService educationService;

    @GetMapping
    public List<SubjectDto> getAll() {
        return educationService.getAllSubjects();
    }

    @PostMapping
    public SubjectDto create(@RequestBody SubjectDto subject) {
        return educationService.saveSubject(subject);
    }
}

