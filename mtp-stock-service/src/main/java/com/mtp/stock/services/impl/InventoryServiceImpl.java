package com.mtp.stock.services.impl;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.repositories.InventoryRepository;
import com.mtp.stock.repositories.InventoryTransactionRepository;
import com.mtp.stock.repositories.AssetCategoryRepository;
import com.mtp.stock.services.ImageUploadService;
import com.mtp.stock.services.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private InventoryTransactionRepository transactionRepository;

    @Autowired
    private AssetCategoryRepository categoryRepository;
    
    @Autowired
    private com.mtp.stock.repositories.DepartmentRepository departmentRepository;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    @Autowired(required = false)
    private com.mtp.stock.repositories.AssetBrandRepository brandRepository;

    @Autowired(required = false)
    private com.mtp.stock.repositories.AssetSupplierRepository supplierRepository;

    @Autowired(required = false)
    private com.mtp.stock.repositories.AssetDonorRepository donorRepository;

    @Override
    public Page<InventoryItem> getAllItems(String search, String category, Pageable pageable) {
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

        try {
            org.springframework.data.domain.Pageable topPage = org.springframework.data.domain.PageRequest.of(0, 4,
                    org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
                            "stockQuantity"));
            org.springframework.data.domain.Page<InventoryItem> topItemsPage = inventoryRepository
                    .findAll(topPage);

            List<Map<String, Object>> topItemsList = new ArrayList<>();
            for (InventoryItem itm : topItemsPage.getContent()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", itm.getId());
                itemMap.put("name", itm.getName());
                itemMap.put("sku", itm.getSku());
                itemMap.put("category", itm.getCategory() != null ? itm.getCategory().getName() : "General");
                itemMap.put("stockQuantity", itm.getStockQuantity() != null ? itm.getStockQuantity() : 0);
                itemMap.put("price", itm.getPrice() != null ? itm.getPrice() : 0.0);
                topItemsList.add(itemMap);
            }
            stats.put("topItems", topItemsList);
        } catch (Exception ignored) {
        }

        try {
            if (transactionRepository != null) {
                org.springframework.data.domain.Pageable recentPage = org.springframework.data.domain.PageRequest.of(0,
                        5, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
                                "transactionDate"));
                org.springframework.data.domain.Page<com.mtp.stock.models.InventoryTransaction> recentTxPage = transactionRepository
                        .findAll(recentPage);

                List<Map<String, Object>> txList = new ArrayList<>();
                for (com.mtp.stock.models.InventoryTransaction tx : recentTxPage.getContent()) {
                    Map<String, Object> txMap = new HashMap<>();
                    txMap.put("id", tx.getId());
                    txMap.put("itemName", tx.getItem() != null ? tx.getItem().getName() : "General Item");
                    txMap.put("type", tx.getType() != null ? tx.getType().name() : "TRANSFER");
                    txMap.put("quantity", tx.getQuantity() != null ? tx.getQuantity() : 0);
                    txList.add(txMap);
                }
                stats.put("recentTransactions", txList);
            }
        } catch (Exception ignored) {
        }

        return stats;
    }

    @Override
    public Map<String, String> generateSku(Long categoryId) {
        String prefix = "GEN";
        if (categoryId != null) {
            java.util.Optional<com.mtp.stock.models.AssetCategory> catOpt = categoryRepository.findById(categoryId);
            if (catOpt.isPresent() && catOpt.get().getPrefixCode() != null
                    && !catOpt.get().getPrefixCode().trim().isEmpty()) {
                prefix = catOpt.get().getPrefixCode().trim().toUpperCase();
            }
        }

        String maxSku = inventoryRepository.findMaxSkuByPrefix(prefix + "-");
        int nextNum = 1;
        if (maxSku != null) {
            try {
                String numStr = maxSku.substring(prefix.length() + 1);
                nextNum = Integer.parseInt(numStr) + 1;
            } catch (Exception e) {
            }
        }

        String sku = String.format("%s-%05d", prefix, nextNum);
        
        int attempts = 0;
        while (inventoryRepository.existsBySkuIgnoreCase(sku) && attempts < 10) {
            nextNum++;
            sku = String.format("%s-%05d", prefix, nextNum);
            attempts++;
        }

        Map<String, String> result = new HashMap<>();
        result.put("sku", sku);
        return result;
    }

    @Override
    public List<String> getCategories() {
        return inventoryRepository.findDistinctCategories();
    }

    @Override
    public List<String> getUoms() {
        return inventoryRepository.findDistinctUoms();
    }

    @Override
    public List<String> getBrands() {
        return inventoryRepository.findDistinctBrands();
    }

    @Override
    public List<String> getBins() {
        return inventoryRepository.findDistinctLocationBins();
    }

    @Override
    public List<String> getDonors() {
        return inventoryRepository.findDistinctDonors();
    }

    @Override
    public List<String> getGrantCodes() {
        return inventoryRepository.findDistinctGrantCodes();
    }

    @Override
    public List<String> getSuppliers() {
        return inventoryRepository.findDistinctSuppliers();
    }

    @Override
    public List<com.mtp.stock.models.stubs.DepartmentStub> getDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public InventoryItem getById(Long id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    @Override
    public InventoryItem create(InventoryItem item) {
        if (item.getSku() == null || item.getSku().trim().isEmpty()) {
            Long catId = item.getCategory() != null ? item.getCategory().getId() : null;
            String generatedSku = generateSku(catId).get("sku");

            int attempts = 0;
            while (inventoryRepository.existsBySkuIgnoreCase(generatedSku) && attempts < 10) {
                generatedSku = generateSku(catId).get("sku");
                if (inventoryRepository.existsBySkuIgnoreCase(generatedSku)) {
                    generatedSku = generatedSku + "-" + (System.currentTimeMillis() % 10000);
                }
                attempts++;
            }
            item.setSku(generatedSku.trim());
        } else {
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

        if (item.getExpiryDate() != null && item.getExpiryDate().trim().isEmpty()) {
            item.setExpiryDate(null);
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

    @Override
    public InventoryItem update(Long id, InventoryItem itemDetails) {
        java.util.Optional<InventoryItem> itemOpt = inventoryRepository.findById(id);
        if (itemOpt.isEmpty()) {
            throw new IllegalArgumentException("Item not found");
        }
        
        InventoryItem item = itemOpt.get();

        if (itemDetails.getVersion() != null) {
            Long currentVersion = item.getVersion() != null ? item.getVersion() : 0L;
            if (!currentVersion.equals(itemDetails.getVersion())) {
                throw new IllegalStateException("Conflict: Item was modified by another user.");
            }
        }

        item.setName(itemDetails.getName());
        item.setSku(itemDetails.getSku());
        item.setCategory(itemDetails.getCategory());
        item.setDescription(itemDetails.getDescription());
        item.setBrand(itemDetails.getBrand());
        item.setPrice(itemDetails.getPrice());
        item.setCostPrice(itemDetails.getCostPrice());
        item.setDiscountPercentage(itemDetails.getDiscountPercentage());

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

        item.setUnitOfMeasure(itemDetails.getUnitOfMeasure());
        item.setSupplierName(itemDetails.getSupplierName());
        item.setDonorName(itemDetails.getDonorName());
        item.setGrantCode(itemDetails.getGrantCode());
        item.setLocationBin(itemDetails.getLocationBin());
        item.setBatchNumber(itemDetails.getBatchNumber());

        if (itemDetails.getExpiryDate() != null && itemDetails.getExpiryDate().trim().isEmpty()) {
            item.setExpiryDate(null);
        } else {
            item.setExpiryDate(itemDetails.getExpiryDate());
        }

        if (itemDetails.getImageUrl() != null && itemDetails.getImageUrl().startsWith("data:image")) {
            try {
                String url = imageUploadService.uploadBase64Image(itemDetails.getImageUrl(), "inventory");
                if (url != null) {
                    item.setImageUrl(url);
                }
            } catch (Exception ignored) {
            }
        }

        return inventoryRepository.save(item);
    }

    @Override
    public void delete(Long id) {
        java.util.Optional<InventoryItem> existingOpt = inventoryRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new IllegalArgumentException("Item not found");
        }
        InventoryItem existing = existingOpt.get();
        try {
            inventoryRepository.delete(existing);
        } catch (Exception e) {
            existing.setActive(false);
            inventoryRepository.save(existing);
        }
    }

    @org.springframework.transaction.annotation.Transactional
    @Override
    public void renameAttribute(String field, String oldValue, String newValue) {
        if (oldValue == null || oldValue.trim().isEmpty() || newValue == null || newValue.trim().isEmpty()) {
            throw new IllegalArgumentException("Old value and new value cannot be empty");
        }
        String cleanOld = oldValue.trim();
        String cleanNew = newValue.trim();

        java.util.Set<String> allowedFields = java.util.Set.of("unitOfMeasure", "brand", "supplierName", "locationBin", "donorName", "grantCode");
        if (!allowedFields.contains(field)) {
            throw new IllegalArgumentException("Unsupported attribute field: " + field);
        }

        String jpql = String.format("UPDATE InventoryItem i SET i.%s = :newVal WHERE i.%s = :oldVal", field, field);
        entityManager.createQuery(jpql)
                .setParameter("newVal", cleanNew)
                .setParameter("oldVal", cleanOld)
                .executeUpdate();

        // Sync with master tables if applicable
        try {
            if ("brand".equals(field) && brandRepository != null) {
                brandRepository.findByName(cleanOld).ifPresent(b -> {
                    b.setName(cleanNew);
                    brandRepository.save(b);
                });
            } else if ("supplierName".equals(field) && supplierRepository != null) {
                supplierRepository.findByName(cleanOld).ifPresent(s -> {
                    s.setName(cleanNew);
                    supplierRepository.save(s);
                });
            } else if ("donorName".equals(field) && donorRepository != null) {
                donorRepository.findByName(cleanOld).ifPresent(d -> {
                    d.setName(cleanNew);
                    donorRepository.save(d);
                });
            }
        } catch (Exception ignored) {
        }
    }

    @org.springframework.transaction.annotation.Transactional
    @Override
    public void deleteAttribute(String field, String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Value cannot be empty");
        }
        String cleanVal = value.trim();

        java.util.Set<String> allowedFields = java.util.Set.of("unitOfMeasure", "brand", "supplierName", "locationBin", "donorName", "grantCode");
        if (!allowedFields.contains(field)) {
            throw new IllegalArgumentException("Unsupported attribute field: " + field);
        }

        String jpql = String.format("UPDATE InventoryItem i SET i.%s = NULL WHERE i.%s = :val", field, field);
        entityManager.createQuery(jpql)
                .setParameter("val", cleanVal)
                .executeUpdate();

        // Remove from master tables if applicable
        try {
            if ("brand".equals(field) && brandRepository != null) {
                brandRepository.findByName(cleanVal).ifPresent(brandRepository::delete);
            } else if ("supplierName".equals(field) && supplierRepository != null) {
                supplierRepository.findByName(cleanVal).ifPresent(supplierRepository::delete);
            } else if ("donorName".equals(field) && donorRepository != null) {
                donorRepository.findByName(cleanVal).ifPresent(donorRepository::delete);
            }
        } catch (Exception ignored) {
        }
    }
}
