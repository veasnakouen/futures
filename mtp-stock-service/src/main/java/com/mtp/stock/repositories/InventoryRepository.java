package com.mtp.stock.repositories;

import com.mtp.stock.models.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.util.List;

@Repository // Not neccessary, JpaRepository already has it
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    // SELECT * FROM inventory_items WHERE category = ?
    Page<InventoryItem> findByCategory(String category, org.springframework.data.domain.Pageable pageable);
    List<InventoryItem> findByCategory(String category);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.category FROM InventoryItem i WHERE i.category IS NOT NULL AND i.category != ''")
    List<String> findDistinctCategories();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.location FROM InventoryItem i WHERE i.location IS NOT NULL AND i.location != ''")
    List<String> findDistinctLocations();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.unit FROM InventoryItem i WHERE i.unit IS NOT NULL AND i.unit != ''")
    List<String> findDistinctUnits();

    List<InventoryItem> findByStatus(String status);
}
