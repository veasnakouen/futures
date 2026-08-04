package com.mtp.stock.controllers;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.models.stubs.DepartmentStub;
import com.mtp.stock.services.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public Page<InventoryItem> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return inventoryService.getAll(search, category, pageable);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
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

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentStub>> getDepartments() {
        return ResponseEntity.ok(inventoryService.getDepartments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getById(@PathVariable Long id) {
        return inventoryService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public InventoryItem create(@Valid @RequestBody InventoryItem item) {
        return inventoryService.create(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> update(@PathVariable Long id, @Valid @RequestBody InventoryItem itemDetails) {
        return inventoryService.update(id, itemDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (inventoryService.delete(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
