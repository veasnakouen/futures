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

    @Autowired
    private com.mtp.stock.repositories.InventoryTransactionRepository transactionRepository;

    @Autowired
    private com.mtp.stock.repositories.AssetCategoryRepository categoryRepository;

    @GetMapping
    @Cacheable(value = "inventory", key = "#search + '-' + #category + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort")
    public Page<InventoryItem> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasCategory = category != null && !category.trim().isEmpty();

        if (hasSearch && hasCategory) {
            return inventoryRepository.findBySearchAndCategory(search.trim(), category.trim(), pageable);
        } else if (hasSearch) {
            return inventoryRepository.findBySearch(search.trim(), pageable);
        } else if (hasCategory) {
            return inventoryRepository.findByCategory(category, pageable);
        }
        return inventoryRepository.findAll(pageable);
    }

    @GetMapping("/stats")
    @Cacheable(value = "inventory", key = "'stats'")
    public ResponseEntity<?> getStats() {
        Double valuation = inventoryRepository.sumValuation();
        Long lowStock = inventoryRepository.countLowStock();
        Long outOfStock = inventoryRepository.countOutOfStock();
        long totalItems = inventoryRepository.count();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("valuation", valuation != null ? valuation : 0.0);
        stats.put("lowStock", lowStock != null ? lowStock : 0L);
        stats.put("outOfStock", outOfStock != null ? outOfStock : 0L);
        stats.put("totalItems", totalItems);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/generate-sku")
    public ResponseEntity<java.util.Map<String, String>> generateSku(@RequestParam(required = false) Long categoryId) {
        String prefix = "ITM";
        
        if (categoryId != null) {
            java.util.Optional<com.mtp.stock.models.AssetCategory> catOpt = categoryRepository.findById(categoryId);
            if (catOpt.isPresent() && catOpt.get().getPrefixCode() != null && !catOpt.get().getPrefixCode().trim().isEmpty()) {
                prefix = catOpt.get().getPrefixCode().trim().toUpperCase();
            }
        }
        
        String maxSku = inventoryRepository.findMaxSkuByPrefix(prefix);
        String newSku = prefix + "-00001";
        
        if (maxSku != null && maxSku.startsWith(prefix + "-")) {
            try {
                String numPart = maxSku.substring(prefix.length() + 1);
                int nextNum = Integer.parseInt(numPart) + 1;
                newSku = String.format("%s-%05d", prefix, nextNum);
            } catch (Exception e) {
                // If parsing fails, stick to default or random
                newSku = prefix + "-" + System.currentTimeMillis();
            }
        }
        
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("sku", newSku);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    @Cacheable(value = "inventory", key = "'categories'")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(inventoryRepository.findDistinctCategories());
    }

    @Autowired
    private com.mtp.stock.repositories.DepartmentRepository departmentRepository;

    @GetMapping("/departments")
    @Cacheable(value = "inventory", key = "'departments'")
    public ResponseEntity<List<com.mtp.stock.models.stubs.DepartmentStub>> getDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @GetMapping("/{id}")
    @Cacheable(value = "inventory", key = "#id")
    public ResponseEntity<InventoryItem> getById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public InventoryItem create(@jakarta.validation.Valid @RequestBody InventoryItem item) {
        if (item.getSku() == null || item.getSku().trim().isEmpty()) {
            Long catId = item.getCategory() != null ? item.getCategory().getId() : null;
            item.setSku(generateSku(catId).getBody().get("sku"));
        }

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
        
        InventoryItem savedItem = inventoryRepository.save(item);
        
        if (savedItem.getStockQuantity() != null && savedItem.getStockQuantity() > 0) {
            com.mtp.stock.models.InventoryTransaction tx = new com.mtp.stock.models.InventoryTransaction();
            tx.setItem(savedItem);
            tx.setType(com.mtp.stock.enums.InventoryTransactionType.ADJUSTMENT);
            tx.setQuantity(savedItem.getStockQuantity());
            tx.setRemarks("Initial Stock");
            tx.setCreatedBy("admin");
            transactionRepository.save(tx);
        }
        
        return savedItem;
    }

    @PutMapping("/{id}")
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public ResponseEntity<InventoryItem> update(@PathVariable Long id,
            @jakarta.validation.Valid @RequestBody InventoryItem itemDetails) {
        return inventoryRepository.findById(id).map(item -> {
            item.setName(itemDetails.getName());
            item.setSku(itemDetails.getSku());
            item.setCategory(itemDetails.getCategory());
            item.setDescription(itemDetails.getDescription());
            item.setBrand(itemDetails.getBrand());
            item.setPrice(itemDetails.getPrice());
            item.setCostPrice(itemDetails.getCostPrice());
            item.setDiscountPercentage(itemDetails.getDiscountPercentage());
            
            Integer oldStock = item.getStockQuantity() != null ? item.getStockQuantity() : 0;
            Integer newStock = itemDetails.getStockQuantity() != null ? itemDetails.getStockQuantity() : 0;
            
            item.setStockQuantity(newStock);
            item.setReorderLevel(itemDetails.getReorderLevel());
            item.setWeight(itemDetails.getWeight());
            item.setActive(itemDetails.getActive());
            item.setFeatured(itemDetails.getFeatured());
            item.setRating(itemDetails.getRating());
            item.setReviewCount(itemDetails.getReviewCount());
            item.setDepartment(itemDetails.getDepartment());
            item.setTrackStock(itemDetails.getTrackStock());

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

            InventoryItem savedItem = inventoryRepository.save(item);
            
            if (!oldStock.equals(newStock)) {
                com.mtp.stock.models.InventoryTransaction tx = new com.mtp.stock.models.InventoryTransaction();
                tx.setItem(savedItem);
                tx.setType(com.mtp.stock.enums.InventoryTransactionType.ADJUSTMENT);
                tx.setQuantity(newStock - oldStock);
                tx.setRemarks("Manual Stock Adjustment via Edit");
                tx.setCreatedBy("admin");
                transactionRepository.save(tx);
            }

            return ResponseEntity.ok(savedItem);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return inventoryRepository.findById(id).map(item -> {
            inventoryRepository.delete(item);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
