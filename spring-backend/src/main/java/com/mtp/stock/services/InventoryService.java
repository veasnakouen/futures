package com.mtp.stock.services;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.models.stubs.DepartmentStub;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface InventoryService {
    Page<InventoryItem> getAll(String search, String category, Pageable pageable);
    Map<String, Object> getStats();
    Map<String, String> generateSku(Long categoryId);
    List<String> getCategories();
    List<DepartmentStub> getDepartments();
    Optional<InventoryItem> getById(Long id);
    InventoryItem create(InventoryItem item);
    Optional<InventoryItem> update(Long id, InventoryItem itemDetails);
    boolean delete(Long id);
}
