package com.mtp.stock.controllers;

import com.mtp.stock.models.AssetCategory;
import com.mtp.stock.repositories.AssetCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/stock/categories")
public class AssetCategoryController {

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<AssetCategory>> getAll() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetCategory> getById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AssetCategory> create(@Valid @RequestBody AssetCategory category) {
        if (categoryRepository.findByNameIgnoreCase(category.getName()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetCategory> update(@PathVariable Long id, @Valid @RequestBody AssetCategory categoryData) {
        java.util.Optional<AssetCategory> existingOpt = categoryRepository.findById(id);
        if (existingOpt.isPresent()) {
            AssetCategory existing = existingOpt.get();
            existing.setName(categoryData.getName());
            existing.setDescription(categoryData.getDescription());
            existing.setPrefixCode(categoryData.getPrefixCode());
            if (categoryData.getIsActive() != null) existing.setIsActive(categoryData.getIsActive());
            if (categoryData.getRequiresExpiryDate() != null) existing.setRequiresExpiryDate(categoryData.getRequiresExpiryDate());
            if (categoryData.getRequiresSerialTracking() != null) existing.setRequiresSerialTracking(categoryData.getRequiresSerialTracking());
            existing.setIconName(categoryData.getIconName());
            existing.setColorHex(categoryData.getColorHex());
            
            if (categoryData.getParentCategory() != null && categoryData.getParentCategory().getId() != null) {
                if (categoryData.getParentCategory().getId().equals(id)) {
                    return ResponseEntity.badRequest().build();
                }
                existing.setParentCategory(categoryData.getParentCategory());
            } else {
                existing.setParentCategory(null);
            }
            
            return ResponseEntity.ok(categoryRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        java.util.Optional<AssetCategory> existingOpt = categoryRepository.findById(id);
        if (existingOpt.isPresent()) {
            AssetCategory existing = existingOpt.get();
            try {
                categoryRepository.delete(existing);
            } catch (Exception e) {
                // If it fails (e.g. Foreign Key constraint), perform a Soft Delete instead
                existing.setIsActive(false);
                categoryRepository.save(existing);
            }
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
