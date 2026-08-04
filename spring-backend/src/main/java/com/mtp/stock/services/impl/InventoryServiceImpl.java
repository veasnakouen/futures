package com.mtp.stock.services.impl;

import com.mtp.stock.enums.InventoryTransactionType;
import com.mtp.stock.models.AssetCategory;
import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.models.InventoryTransaction;
import com.mtp.stock.models.stubs.DepartmentStub;
import com.mtp.stock.repositories.AssetCategoryRepository;
import com.mtp.stock.repositories.DepartmentRepository;
import com.mtp.stock.repositories.InventoryRepository;
import com.mtp.stock.repositories.InventoryTransactionRepository;
import com.mtp.stock.services.ImageUploadService;
import com.mtp.stock.services.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final AssetCategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;
    private final ImageUploadService imageUploadService;

    @Override
    @Cacheable(value = "inventory", key = "#search + '-' + #category + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort")
    public Page<InventoryItem> getAll(String search, String category, Pageable pageable) {
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

    @Override
    @Cacheable(value = "inventory", key = "'stats'")
    public Map<String, Object> getStats() {
        Double valuation = inventoryRepository.sumValuation();
        Long lowStock = inventoryRepository.countLowStock();
        Long outOfStock = inventoryRepository.countOutOfStock();
        long totalItems = inventoryRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("valuation", valuation != null ? valuation : 0.0);
        stats.put("lowStock", lowStock != null ? lowStock : 0L);
        stats.put("outOfStock", outOfStock != null ? outOfStock : 0L);
        stats.put("totalItems", totalItems);
        return stats;
    }

    @Override
    public Map<String, String> generateSku(Long categoryId) {
        String prefix = "ITM";

        if (categoryId != null) {
            Optional<AssetCategory> catOpt = categoryRepository.findById(categoryId);
            if (catOpt.isPresent()) {
                AssetCategory cat = catOpt.get();
                if (cat.getPrefixCode() != null && !cat.getPrefixCode().trim().isEmpty()) {
                    prefix = cat.getPrefixCode().trim().toUpperCase();
                } else if (cat.getName() != null && !cat.getName().trim().isEmpty()) {
                    // Smart fallback: derive prefix from category name if missing
                    String derived = cat.getName().replaceAll("[^A-Za-z]", "").toUpperCase();
                    if (derived.length() > 6) {
                        prefix = derived.substring(0, 6);
                    } else if (!derived.isEmpty()) {
                        prefix = derived;
                    }
                }
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
                newSku = prefix + "-" + System.currentTimeMillis();
            }
        }

        Map<String, String> response = new HashMap<>();
        response.put("sku", newSku);
        return response;
    }

    @Override
    @Cacheable(value = "inventory", key = "'categories'")
    public List<String> getCategories() {
        return inventoryRepository.findDistinctCategories();
    }

    @Override
    @Cacheable(value = "inventory", key = "'departments'")
    public List<DepartmentStub> getDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    @Cacheable(value = "inventory", key = "#id")
    public Optional<InventoryItem> getById(Long id) {
        return inventoryRepository.findById(id);
    }

    @Override
    @Transactional
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public InventoryItem create(InventoryItem item) {
        if (item.getSku() == null || item.getSku().trim().isEmpty()) {
            Long catId = item.getCategory() != null ? item.getCategory().getId() : null;
            String generatedSku = generateSku(catId).get("sku");
            
            // Concurrency safety loop
            int attempts = 0;
            while (inventoryRepository.existsBySkuIgnoreCase(generatedSku) && attempts < 10) {
                generatedSku = generateSku(catId).get("sku");
                // If it STILL matches, force uniqueness by appending a random suffix
                if (inventoryRepository.existsBySkuIgnoreCase(generatedSku)) {
                    generatedSku = generatedSku + "-" + (System.currentTimeMillis() % 10000);
                }
                attempts++;
            }
            item.setSku(generatedSku.trim());
        } else {
            // User provided custom SKU. Ensure it's unique.
            String trimmedSku = item.getSku().trim();
            if (inventoryRepository.existsBySkuIgnoreCase(trimmedSku)) {
                throw new IllegalArgumentException("SKU already exists: " + trimmedSku);
            }
            item.setSku(trimmedSku);
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
                item.setImageUrl(item.getImageUrl());
            }
        }

        InventoryItem savedItem = inventoryRepository.save(item);

        if (savedItem.getStockQuantity() != null && savedItem.getStockQuantity() > 0) {
            InventoryTransaction tx = new InventoryTransaction();
            tx.setItem(savedItem);
            tx.setType(InventoryTransactionType.ADJUSTMENT);
            tx.setQuantity(savedItem.getStockQuantity());
            tx.setRemarks("Initial Stock");
            tx.setCreatedBy("admin");
            transactionRepository.save(tx);
        }

        return savedItem;
    }

    @Override
    @Transactional
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public Optional<InventoryItem> update(Long id, InventoryItem itemDetails) {
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
                InventoryTransaction tx = new InventoryTransaction();
                tx.setItem(savedItem);
                tx.setType(InventoryTransactionType.ADJUSTMENT);
                tx.setQuantity(newStock - oldStock);
                tx.setRemarks("Manual Stock Adjustment via Edit");
                tx.setCreatedBy("admin");
                transactionRepository.save(tx);
            }

            return savedItem;
        });
    }

    @Override
    @Transactional
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public boolean delete(Long id) {
        return inventoryRepository.findById(id).map(item -> {
            inventoryRepository.delete(item);
            return true;
        }).orElse(false);
    }
}
