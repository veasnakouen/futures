package com.mtp.stock.services;

import com.mtp.stock.models.InventoryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

public interface InventoryService {
    Page<InventoryItem> getAllItems(String search, String category, Pageable pageable);
    Map<String, Object> getStats();
    Map<String, String> generateSku(Long categoryId);
    List<String> getCategories();
    List<String> getUoms();
    List<String> getBrands();
    List<String> getBins();
    List<String> getDonors();
    List<String> getGrantCodes();
    List<String> getSuppliers();
    List<com.mtp.stock.models.stubs.DepartmentStub> getDepartments();
    InventoryItem getById(Long id);
    InventoryItem create(InventoryItem item);
    InventoryItem update(Long id, InventoryItem itemDetails);
    void delete(Long id);
    void renameAttribute(String field, String oldValue, String newValue);
    void deleteAttribute(String field, String value);
}
