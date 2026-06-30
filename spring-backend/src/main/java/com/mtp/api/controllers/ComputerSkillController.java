package com.mtp.api.controllers;

import com.mtp.api.models.ComputerSkill;
import com.mtp.api.repositories.ComputerSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/computer-skills")
@CrossOrigin(origins = "*")
public class ComputerSkillController {

    @Autowired
    private ComputerSkillRepository repository;

    @GetMapping("/client/{clientId}")
    public List<ComputerSkill> getByClientId(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }

    @PostMapping
    public ResponseEntity<ComputerSkill> create(@RequestBody @NonNull ComputerSkill skill) {
        return ResponseEntity.ok(repository.save(skill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComputerSkill> update(@PathVariable Integer id, @RequestBody @NonNull ComputerSkill details) {
        return repository.findById(id).map(existing -> {
            details.setId(id);
            return ResponseEntity.ok(repository.save(details));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return repository.findById(id).map((@NonNull ComputerSkill existing) -> {
            repository.delete(existing);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
