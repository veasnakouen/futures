package com.mtp.api.controllers;

import com.mtp.api.models.GlobalCustomEntityDefinition;
import com.mtp.api.models.GlobalDynamicEntityRecord;
import com.mtp.api.models.GlobalEntityRelationshipDefinition;
import com.mtp.api.services.GlobalEntityBuilderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dynamic-entities")
@RequiredArgsConstructor
public class AdminEntityBuilderController {

    private final GlobalEntityBuilderService entityBuilderService;

    @GetMapping
    public ResponseEntity<List<GlobalCustomEntityDefinition>> getAllEntities() {
        return ResponseEntity.ok(entityBuilderService.getAllEntities());
    }

    @PostMapping
    public ResponseEntity<GlobalCustomEntityDefinition> createEntity(@RequestBody GlobalCustomEntityDefinition entity) {
        return ResponseEntity.ok(entityBuilderService.createEntity(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntity(@PathVariable String id) {
        entityBuilderService.deleteEntity(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{entityKey}/relationships")
    public ResponseEntity<List<GlobalEntityRelationshipDefinition>> getRelationships(@PathVariable String entityKey) {
        return ResponseEntity.ok(entityBuilderService.getRelationships(entityKey));
    }

    @PostMapping("/relationships")
    public ResponseEntity<GlobalEntityRelationshipDefinition> createRelationship(@RequestBody GlobalEntityRelationshipDefinition rel) {
        return ResponseEntity.ok(entityBuilderService.createRelationship(rel));
    }

    @GetMapping("/{entityKey}/records")
    public ResponseEntity<List<GlobalDynamicEntityRecord>> getRecords(@PathVariable String entityKey) {
        return ResponseEntity.ok(entityBuilderService.getRecords(entityKey));
    }

    @PostMapping("/{entityKey}/records")
    public ResponseEntity<GlobalDynamicEntityRecord> createRecord(@PathVariable String entityKey, @RequestBody GlobalDynamicEntityRecord record) {
        return ResponseEntity.ok(entityBuilderService.createRecord(entityKey, record));
    }
}
