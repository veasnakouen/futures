package com.mtp.stock.services.impl;

import com.mtp.stock.models.AssetCategory;
import com.mtp.stock.repositories.AssetCategoryRepository;
import com.mtp.stock.services.AssetCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetCategoryServiceImpl implements AssetCategoryService {

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @Override
    public List<AssetCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<AssetCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public AssetCategory createCategory(AssetCategory category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }
        category.setName(category.getName().trim());
        
        if (categoryRepository.findByNameIgnoreCase(category.getName()).isPresent()) {
            throw new IllegalArgumentException("Category name '" + category.getName() + "' already exists");
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
        
        return categoryRepository.save(category);
    }

    @Override
    public AssetCategory updateCategory(Long id, AssetCategory categoryData) {
        Optional<AssetCategory> existingOpt = categoryRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new IllegalArgumentException("Category not found with id " + id);
        }
        
        AssetCategory existing = existingOpt.get();
        if (categoryData.getName() != null && !categoryData.getName().trim().isEmpty()) {
            String trimmedName = categoryData.getName().trim();
            Optional<AssetCategory> withSameName = categoryRepository.findByNameIgnoreCase(trimmedName);
            if (withSameName.isPresent() && !withSameName.get().getId().equals(id)) {
                throw new IllegalArgumentException("Category name '" + trimmedName + "' already exists");
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
                throw new IllegalArgumentException("Category cannot be its own parent");
            }
            existing.setParentCategory(categoryData.getParentCategory());
        } else {
            existing.setParentCategory(null);
        }
        
        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(Long id) {
        Optional<AssetCategory> existingOpt = categoryRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new IllegalArgumentException("Category not found with id " + id);
        }
        
        AssetCategory existing = existingOpt.get();
        try {
            categoryRepository.delete(existing);
        } catch (Exception e) {
            // If it fails (e.g. Foreign Key constraint), perform a Soft Delete instead
            existing.setIsActive(false);
            categoryRepository.save(existing);
        }
    }
}
