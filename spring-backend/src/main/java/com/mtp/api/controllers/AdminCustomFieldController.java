package com.mtp.api.controllers;

import com.mtp.api.models.GlobalCustomFieldDefinition;
import com.mtp.api.repositories.GlobalCustomFieldRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/custom-fields")
public class AdminCustomFieldController {

    private final GlobalCustomFieldRepository repository;

    public AdminCustomFieldController(GlobalCustomFieldRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasAuthority('SYSTEM_CONFIG') or hasRole('SUPERADMIN')")
    public ResponseEntity<List<GlobalCustomFieldDefinition>> getCustomFields(@RequestParam(required = false) String entityType) {
        if (entityType != null && !entityType.isBlank()) {
            return ResponseEntity.ok(repository.findByEntityTypeOrderByCreatedAtDesc(entityType.toUpperCase()));
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasAuthority('SYSTEM_CONFIG') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> createCustomField(@RequestBody GlobalCustomFieldDefinition field) {
        if (field.getEntityType() == null || field.getEntityType().isBlank()) {
            return ResponseEntity.badRequest().body("Entity type is required");
        }
        if (field.getFieldLabel() == null || field.getFieldLabel().isBlank()) {
            return ResponseEntity.badRequest().body("Field label is required");
        }

        String entityTypeUpper = field.getEntityType().toUpperCase();
        field.setEntityType(entityTypeUpper);

        if (field.getFieldKey() == null || field.getFieldKey().isBlank()) {
            // Auto generate fieldKey from fieldLabel
            String generatedKey = field.getFieldLabel().toLowerCase()
                    .replaceAll("[^a-zA-Z0-9\\s]", "")
                    .replaceAll("\\s+", "_");
            field.setFieldKey(generatedKey);
        }

        if (repository.findByEntityTypeAndFieldKey(entityTypeUpper, field.getFieldKey()).isPresent()) {
            return ResponseEntity.badRequest().body("Custom field key '" + field.getFieldKey() + "' already exists for entity " + entityTypeUpper);
        }

        GlobalCustomFieldDefinition saved = repository.save(field);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasAuthority('SYSTEM_CONFIG') or hasRole('SUPERADMIN')")
    public ResponseEntity<Void> deleteCustomField(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
