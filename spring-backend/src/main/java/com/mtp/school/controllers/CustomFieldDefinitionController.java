package com.mtp.school.controllers;

import com.mtp.school.models.CustomFieldDefinition;
import com.mtp.school.repositories.CustomFieldDefinitionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("schoolCustomFieldDefinitionController")
@RequestMapping("/api/school/custom-fields")
public class CustomFieldDefinitionController {

    private final CustomFieldDefinitionRepository repository;

    public CustomFieldDefinitionController(CustomFieldDefinitionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<CustomFieldDefinition>> getFields(@RequestParam(required = false) String entityType) {
        if (entityType != null) {
            return ResponseEntity.ok(repository.findByEntityType(entityType));
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<CustomFieldDefinition> createField(@RequestBody CustomFieldDefinition field) {
        return ResponseEntity.ok(repository.save(field));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteField(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
