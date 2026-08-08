package com.mtp.stock.services;

import com.mtp.stock.models.AssetCategory;
import java.util.List;
import java.util.Optional;

public interface AssetCategoryService {
    List<AssetCategory> getAllCategories();
    Optional<AssetCategory> getCategoryById(Long id);
    AssetCategory createCategory(AssetCategory category);
    AssetCategory updateCategory(Long id, AssetCategory categoryData);
    void deleteCategory(Long id);
}
