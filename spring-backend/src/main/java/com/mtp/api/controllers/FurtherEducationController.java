package com.mtp.api.controllers;

import com.mtp.api.models.FurtherEducation;
import com.mtp.api.repositories.FurtherEducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/further-educations")
public class FurtherEducationController {
    @Autowired
    private FurtherEducationRepository repository;

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getByClient(@PathVariable Integer clientId) {
        List<FurtherEducation> records = repository.findByClientId(clientId);
        if (records != null && !records.isEmpty()) {
            return ResponseEntity.ok(records.get(0));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public FurtherEducation createOrUpdate(@RequestBody FurtherEducation furtherEducation) {
        if (furtherEducation.getClient() == null || furtherEducation.getClient().getId() == null) {
            throw new IllegalArgumentException("Client ID is required");
        }
        List<FurtherEducation> existing = repository.findByClientId(furtherEducation.getClient().getId());
        if (!existing.isEmpty()) {
            FurtherEducation current = existing.get(0);
            current.setUniversity(furtherEducation.isUniversity());
            current.setPublicSchool(furtherEducation.isPublicSchool());
            current.setVocationalTraining(furtherEducation.isVocationalTraining());
            current.setComputerSchool(furtherEducation.isComputerSchool());
            current.setEnglishSchool(furtherEducation.isEnglishSchool());
            current.setChineseSchool(furtherEducation.isChineseSchool());
            current.setAvailableTime(furtherEducation.getAvailableTime());
            return repository.save(current);
        }
        return repository.save(furtherEducation);
    }
}
