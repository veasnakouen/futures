package com.mtp.api.controllers;

import com.mtp.api.models.SocialSupport;
import com.mtp.api.repositories.SocialSupportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/social-supports")

public class SocialSupportController {
    @Autowired
    private SocialSupportRepository repository;

    @GetMapping("/client/{clientId}")
    public List<SocialSupport> getByClient(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }

    @PostMapping
    public SocialSupport create(@RequestBody SocialSupport support) {
        return repository.save(support);
    }

    @PutMapping("/{id}")
    public SocialSupport update(@PathVariable Integer id, @RequestBody SocialSupport details) {
        details.setId(id);
        return repository.save(details);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
