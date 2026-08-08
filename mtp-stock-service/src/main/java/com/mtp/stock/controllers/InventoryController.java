package com.mtp.stock.controllers;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.services.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private com.mtp.stock.config.JwtUtils jwtUtils;

    @GetMapping
    public Page<InventoryItem> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return inventoryService.getAllItems(search, category, pageable);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(inventoryService.getStats());
    }

    @GetMapping("/generate-sku")
    public ResponseEntity<Map<String, String>> generateSku(@RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(inventoryService.generateSku(categoryId));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(inventoryService.getCategories());
    }

    @GetMapping("/uoms")
    public ResponseEntity<List<String>> getUoms() {
        return ResponseEntity.ok(inventoryService.getUoms());
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrands() {
        return ResponseEntity.ok(inventoryService.getBrands());
    }

    @GetMapping("/bins")
    public ResponseEntity<List<String>> getBins() {
        return ResponseEntity.ok(inventoryService.getBins());
    }

    @GetMapping("/donors")
    public ResponseEntity<List<String>> getDonors() {
        return ResponseEntity.ok(inventoryService.getDonors());
    }

    @GetMapping("/grant-codes")
    public ResponseEntity<List<String>> getGrantCodes() {
        return ResponseEntity.ok(inventoryService.getGrantCodes());
    }

    @GetMapping("/suppliers")
    public ResponseEntity<List<String>> getSuppliers() {
        return ResponseEntity.ok(inventoryService.getSuppliers());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<com.mtp.stock.models.stubs.DepartmentStub>> getDepartments() {
        return ResponseEntity.ok(inventoryService.getDepartments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getById(@PathVariable Long id) {
        InventoryItem item = inventoryService.getById(id);
        return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @CacheEvict(value = "inventory", allEntries = true)
    public ResponseEntity<?> create(@jakarta.validation.Valid @RequestBody InventoryItem item) {
        try {
            return ResponseEntity.ok(inventoryService.create(item));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "inventory", allEntries = true)
    public ResponseEntity<?> update(@PathVariable Long id,
            @jakarta.validation.Valid @RequestBody InventoryItem itemDetails) {
        try {
            return ResponseEntity.ok(inventoryService.update(id, itemDetails));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "inventory", allEntries = true)
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            inventoryService.delete(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/attributes/rename")
    @CacheEvict(value = "inventory", allEntries = true)
    public ResponseEntity<?> renameAttribute(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam String field,
            @RequestParam String oldValue,
            @RequestParam String newValue) {
        if (!jwtUtils.isSuperAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied. Only Superadmin can rename master lookup attributes."));
        }
        try {
            inventoryService.renameAttribute(field, oldValue, newValue);
            return ResponseEntity.ok(Map.of("message", "Attribute renamed successfully", "field", field, "oldValue", oldValue, "newValue", newValue));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to rename attribute: " + e.getMessage()));
        }
    }

    @DeleteMapping("/attributes/delete")
    @CacheEvict(value = "inventory", allEntries = true)
    public ResponseEntity<?> deleteAttribute(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam String field,
            @RequestParam String value) {
        if (!jwtUtils.isSuperAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied. Only Superadmin can delete master lookup attributes."));
        }
        try {
            inventoryService.deleteAttribute(field, value);
            return ResponseEntity.ok(Map.of("message", "Attribute deleted successfully", "field", field, "value", value));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to delete attribute: " + e.getMessage()));
        }
    }
}
