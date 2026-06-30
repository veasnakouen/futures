package com.mtp.stock.controllers;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.repositories.InventoryRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/stock/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private com.mtp.stock.services.ImageUploadService imageUploadService;

    @GetMapping
    @Cacheable(value = "inventory", key = "#category != null ? #category + '-' + #pageable.pageNumber + '-' + #pageable.pageSize : 'all-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<InventoryItem> getAll(@RequestParam(required = false) String category, Pageable pageable) {
        if (category != null && !category.isEmpty()) {
            return inventoryRepository.findByCategory(category, pageable);
        }
        return inventoryRepository.findAll(pageable);
    }

    @GetMapping("/stats")
    @Cacheable(value = "inventory", key = "'stats'")
    public ResponseEntity<?> getStats() {
        List<InventoryItem> all = inventoryRepository.findAll();
        double valuation = all.stream().mapToDouble(i -> i.getQuantity() * (i.getUnitPrice() != null ? i.getUnitPrice() : 0)).sum();
        long lowStock = all.stream().filter(i -> i.getQuantity() <= i.getMinQuantity() && i.getQuantity() > 0).count();
        long outOfStock = all.stream().filter(i -> i.getQuantity() <= 0).count();
        
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("valuation", valuation);
        stats.put("lowStock", lowStock);
        stats.put("outOfStock", outOfStock);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/categories")
    @Cacheable(value = "inventory", key = "'categories'")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(inventoryRepository.findDistinctCategories());
    }

    @GetMapping("/locations")
    @Cacheable(value = "inventory", key = "'locations'")
    public ResponseEntity<List<String>> getLocations() {
        return ResponseEntity.ok(inventoryRepository.findDistinctLocations());
    }

    @GetMapping("/units")
    @Cacheable(value = "inventory", key = "'units'")
    public ResponseEntity<List<String>> getUnits() {
        return ResponseEntity.ok(inventoryRepository.findDistinctUnits());
    }

    @GetMapping("/{id}")
    @Cacheable(value = "inventory", key = "#id")
    public ResponseEntity<InventoryItem> getById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @CacheEvict(value = {"dashboardStats", "inventory"}, allEntries = true)
    public InventoryItem create(@jakarta.validation.Valid @RequestBody InventoryItem item) {
        if (item.getImageUrl() != null && item.getImageUrl().startsWith("data:image")) {
            try {
                String url = imageUploadService.uploadBase64Image(item.getImageUrl(), "inventory");
                if (url != null) {
                    item.setImageUrl(url);
                } else {
                    item.setImageUrl(item.getImageUrl());
                }
            } catch (Exception e) {
                // If Cloudinary fails, fallback to saving base64 directly
                item.setImageUrl(item.getImageUrl());
            }
        }
        return inventoryRepository.save(item);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = {"dashboardStats", "inventory"}, allEntries = true)
    public ResponseEntity<InventoryItem> update(@PathVariable Long id, @jakarta.validation.Valid @RequestBody InventoryItem itemDetails) {
        return inventoryRepository.findById(id).map(item -> {
            item.setName(itemDetails.getName());
            item.setSku(itemDetails.getSku());
            item.setCategory(itemDetails.getCategory());
            item.setQuantity(itemDetails.getQuantity());
            item.setUnit(itemDetails.getUnit());
            item.setMinQuantity(itemDetails.getMinQuantity());
            item.setUnitPrice(itemDetails.getUnitPrice());
            item.setLocation(itemDetails.getLocation());
            item.setStatus(itemDetails.getStatus());
            item.setDescription(itemDetails.getDescription());
            
            if (itemDetails.getImageUrl() != null && itemDetails.getImageUrl().startsWith("data:image")) {
                try {
                    String url = imageUploadService.uploadBase64Image(itemDetails.getImageUrl(), "inventory");
                    if (url != null) {
                        item.setImageUrl(url);
                    } else {
                        item.setImageUrl(itemDetails.getImageUrl());
                    }
                } catch (Exception e) {
                    item.setImageUrl(itemDetails.getImageUrl());
                }
            } else {
                item.setImageUrl(itemDetails.getImageUrl());
            }
            
            return ResponseEntity.ok(inventoryRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = {"dashboardStats", "inventory"}, allEntries = true)
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return inventoryRepository.findById(id).map(item -> {
            inventoryRepository.delete(item);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
