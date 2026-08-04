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
    public ResponseEntity<?> create(@Valid @RequestBody AssetCategory category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name is required");
        }
        category.setName(category.getName().trim());
        if (categoryRepository.findByNameIgnoreCase(category.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Category name '" + category.getName() + "' already exists");
        }
        if (category.getPrefixCode() != null && category.getPrefixCode().trim().isEmpty()) {
            category.setPrefixCode(null);
        } else if (category.getPrefixCode() != null) {
            category.setPrefixCode(category.getPrefixCode().trim().toUpperCase());
        }
        if (category.getDescription() != null && category.getDescription().trim().isEmpty()) {
            category.setDescription(null);
        }
        if (category.getIsActive() == null) {
            category.setIsActive(true);
        }
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody AssetCategory categoryData) {
        java.util.Optional<AssetCategory> existingOpt = categoryRepository.findById(id);
        if (existingOpt.isPresent()) {
            AssetCategory existing = existingOpt.get();
            if (categoryData.getName() != null && !categoryData.getName().trim().isEmpty()) {
                String trimmedName = categoryData.getName().trim();
                java.util.Optional<AssetCategory> withSameName = categoryRepository.findByNameIgnoreCase(trimmedName);
                if (withSameName.isPresent() && !withSameName.get().getId().equals(id)) {
                    return ResponseEntity.badRequest().body("Category name '" + trimmedName + "' already exists");
                }
                existing.setName(trimmedName);
            }
            
            if (categoryData.getDescription() != null && categoryData.getDescription().trim().isEmpty()) {
                existing.setDescription(null);
            } else if (categoryData.getDescription() != null) {
                existing.setDescription(categoryData.getDescription().trim());
            }

            String prefix = categoryData.getPrefixCode();
            if (prefix != null && prefix.trim().isEmpty()) {
                prefix = null;
            }
            existing.setPrefixCode(prefix != null ? prefix.trim().toUpperCase() : null);

            if (categoryData.getIsActive() != null) existing.setIsActive(categoryData.getIsActive());
            if (categoryData.getRequiresExpiryDate() != null) existing.setRequiresExpiryDate(categoryData.getRequiresExpiryDate());
            if (categoryData.getRequiresSerialTracking() != null) existing.setRequiresSerialTracking(categoryData.getRequiresSerialTracking());
            existing.setIconName(categoryData.getIconName());
            existing.setColorHex(categoryData.getColorHex());
            
            if (categoryData.getParentCategory() != null && categoryData.getParentCategory().getId() != null) {
                if (categoryData.getParentCategory().getId().equals(id)) {
                    return ResponseEntity.badRequest().body("Category cannot be its own parent");
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
