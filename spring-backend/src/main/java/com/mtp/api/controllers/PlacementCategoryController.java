package com.mtp.api.controllers;

import com.mtp.api.models.PlacementCategory;
import com.mtp.api.repositories.PlacementCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placement-categories")
@CrossOrigin(origins = "*")
@Slf4j
@RequiredArgsConstructor
public class PlacementCategoryController {

    private final PlacementCategoryRepository repository;

    @GetMapping
    public List<PlacementCategory> getAllCategories() {
        return repository.findAll();
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PlacementCategory> createCategory(@RequestBody PlacementCategory category) {
        if (repository.findByName(category.getName()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(repository.save(category));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PlacementCategory> updateCategory(@PathVariable Integer id, @RequestBody PlacementCategory category) {
        return repository.findById(id).map(existing -> {
            if (repository.findByName(category.getName()).filter(c -> !c.getId().equals(id)).isPresent()) {
                return ResponseEntity.badRequest().<PlacementCategory>build();
            }
            existing.setName(category.getName());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
