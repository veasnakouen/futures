package com.mtp.api.controllers;

import com.mtp.api.models.InventoryItem;
import com.mtp.api.repositories.InventoryRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private com.mtp.api.services.ImageUploadService imageUploadService;

    @GetMapping
    @Cacheable(value = "inventory", key = "#pageable")
    public Page<InventoryItem> getAll(Pageable pageable) {
        return inventoryRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @CacheEvict(value = "inventory", allEntries = true)
    public InventoryItem create(@RequestBody InventoryItem item) {
        if (item.getImageUrl() != null && item.getImageUrl().startsWith("data:image")) {
            try {
                item.setImageUrl(imageUploadService.uploadBase64Image(item.getImageUrl(), "inventory"));
            } catch (Exception e) {}
        }
        return inventoryRepository.save(item);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "inventory", allEntries = true)
    public ResponseEntity<InventoryItem> update(@PathVariable Long id, @RequestBody InventoryItem itemDetails) {
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
                    item.setImageUrl(imageUploadService.uploadBase64Image(itemDetails.getImageUrl(), "inventory"));
                } catch (Exception e) {}
            } else {
                item.setImageUrl(itemDetails.getImageUrl());
            }
            
            return ResponseEntity.ok(inventoryRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "inventory", allEntries = true)
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return inventoryRepository.findById(id).map(item -> {
            inventoryRepository.delete(item);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
