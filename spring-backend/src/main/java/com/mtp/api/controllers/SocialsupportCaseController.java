package com.mtp.api.controllers;

import com.mtp.api.models.SocialsupportCase;
import com.mtp.api.repositories.SocialsupportCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/social-support-cases")

public class SocialsupportCaseController {
    @Autowired
    private SocialsupportCaseRepository repository;

    @GetMapping("/client/{clientId}")
    public List<SocialsupportCase> getByClient(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }

    @PostMapping
    public SocialsupportCase create(@RequestBody SocialsupportCase scase) {
        return repository.save(scase);
    }

    @PutMapping("/{id}")
    public SocialsupportCase update(@PathVariable Integer id, @RequestBody SocialsupportCase scase) {
        scase.setId(id);
        return repository.save(scase);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
