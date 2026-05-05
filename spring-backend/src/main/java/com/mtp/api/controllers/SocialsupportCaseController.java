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
}
