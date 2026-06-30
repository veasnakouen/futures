package com.mtp.api.controllers;

import com.mtp.api.models.Personality;
import com.mtp.api.repositories.PersonalityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personalities")
@CrossOrigin(origins = "*")
public class PersonalityController {

    @Autowired
    private PersonalityRepository repository;

    @GetMapping("/client/{clientId}")
    public List<Personality> getByClientId(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }

    @PostMapping
    public ResponseEntity<Personality> create(@RequestBody @NonNull Personality personality) {
        return ResponseEntity.ok(repository.save(personality));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Personality> update(@PathVariable Integer id, @RequestBody @NonNull Personality details) {
        return repository.findById(id).map(existing -> {
            details.setId(id);
            return ResponseEntity.ok(repository.save(details));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return repository.findById(id).map((@NonNull Personality existing) -> {
            repository.delete(existing);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
