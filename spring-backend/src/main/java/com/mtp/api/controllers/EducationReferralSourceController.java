package com.mtp.api.controllers;

import com.mtp.api.models.EducationReferralSource;
import com.mtp.api.repositories.EducationReferralSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/education-referral-sources")
public class EducationReferralSourceController {
    @Autowired
    private EducationReferralSourceRepository repository;

    @PostMapping
    @CacheEvict(value = "lookups", allEntries = true)
    public EducationReferralSource create(@RequestBody EducationReferralSource source) {
        return repository.save(source);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "lookups", allEntries = true)
    public EducationReferralSource update(@PathVariable Integer id, @RequestBody EducationReferralSource source) {
        source.setId(id);
        return repository.save(source);
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "lookups", allEntries = true)
    public void delete(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
