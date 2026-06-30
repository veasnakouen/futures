package com.mtp.api.controllers;

import com.mtp.api.models.Language;
import com.mtp.api.repositories.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
@CrossOrigin(origins = "*")
public class LanguageController {

    @Autowired
    private LanguageRepository repository;

    @GetMapping("/client/{clientId}")
    public List<Language> getByClientId(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }

    @PostMapping
    public ResponseEntity<Language> create(@RequestBody @NonNull Language language) {
        return ResponseEntity.ok(repository.save(language));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Language> update(@PathVariable Integer id, @RequestBody @NonNull Language details) {
        return repository.findById(id).map(existing -> {
            details.setId(id);
            return ResponseEntity.ok(repository.save(details));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return repository.findById(id).map((@NonNull Language existing) -> {
            repository.delete(existing);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
