package com.mtp.api.controllers;

import com.mtp.api.dto.EducationDto;
import com.mtp.api.services.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/educations")

public class EducationController {
    @Autowired
    private EducationService educationService;

    @GetMapping("/client/{clientId}")
    public List<EducationDto> getByClient(@PathVariable Integer clientId) {
        return educationService.getEducationsByClient(clientId);
    }

    @PostMapping
    public EducationDto create(@RequestBody EducationDto education) {
        return educationService.saveEducation(education);
    }

    @PutMapping("/{id}")
    public EducationDto update(@PathVariable Integer id, @RequestBody EducationDto details) {
        details.setId(id);
        return educationService.saveEducation(details);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        educationService.deleteEducation(id);
    }
}

