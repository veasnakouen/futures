package com.mtp.api.controllers;

import com.mtp.api.dto.LessionDto;
import com.mtp.api.services.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lessions")

public class LessionController {
    @Autowired
    private EducationService educationService;

    @GetMapping("/subject/{subjectId}")
    public List<LessionDto> getBySubject(@PathVariable Integer subjectId) {
        return educationService.getLessionsBySubject(subjectId);
    }

    @PostMapping
    public LessionDto create(@RequestBody LessionDto lession) {
        return educationService.saveLession(lession);
    }
}

