package com.mtp.stock.repositories;

import com.mtp.stock.models.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;

@Repository // Not neccessary, JpaRepository already has it
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

        @EntityGraph(attributePaths = { "category", "department" })
        Page<InventoryItem> findAll(org.springframework.data.domain.Pageable pageable);

        // SELECT * FROM inventory_items WHERE category.name = ?
        @EntityGraph(attributePaths = { "category", "department" })
        @org.springframework.data.jpa.repository.Query("SELECT i FROM InventoryItem i WHERE i.category.name = :category")
        Page<InventoryItem> findByCategory(@org.springframework.data.repository.query.Param("category") String category,
                        org.springframework.data.domain.Pageable pageable);

        @EntityGraph(attributePaths = { "category", "department" })
        @org.springframework.data.jpa.repository.Query("SELECT i FROM InventoryItem i WHERE i.category.name = :category")
        List<InventoryItem> findByCategory(
                        @org.springframework.data.repository.query.Param("category") String category);

        @org.springframework.data.jpa.repository.Query("SELECT MAX(i.sku) FROM InventoryItem i WHERE i.sku LIKE CONCAT(:prefix, '%')")
        String findMaxSkuByPrefix(@org.springframework.data.repository.query.Param("prefix") String prefix);

        boolean existsBySkuIgnoreCase(String sku);

        java.util.Optional<InventoryItem> findBySkuIgnoreCase(String sku);

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.category.name FROM InventoryItem i WHERE i.category IS NOT NULL")
        List<String> findDistinctCategories();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.department FROM InventoryItem i WHERE i.department IS NOT NULL")
        List<com.mtp.stock.models.stubs.DepartmentStub> findDistinctDepartments();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.unitOfMeasure FROM InventoryItem i WHERE i.unitOfMeasure IS NOT NULL AND i.unitOfMeasure != ''")
        List<String> findDistinctUoms();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.brand FROM InventoryItem i WHERE i.brand IS NOT NULL AND i.brand != ''")
        List<String> findDistinctBrands();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.locationBin FROM InventoryItem i WHERE i.locationBin IS NOT NULL AND i.locationBin != ''")
        List<String> findDistinctLocationBins();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.donorName FROM InventoryItem i WHERE i.donorName IS NOT NULL AND i.donorName != ''")
        List<String> findDistinctDonors();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.grantCode FROM InventoryItem i WHERE i.grantCode IS NOT NULL AND i.grantCode != ''")
        List<String> findDistinctGrantCodes();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.supplierName FROM InventoryItem i WHERE i.supplierName IS NOT NULL AND i.supplierName != ''")
        List<String> findDistinctSuppliers();

        @EntityGraph(attributePaths = { "category", "department" })
        @org.springframework.data.jpa.repository.Query("SELECT i FROM InventoryItem i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.sku) LIKE LOWER(CONCAT('%', :search, '%'))")
        Page<InventoryItem> findBySearch(@org.springframework.data.repository.query.Param("search") String search,
                        org.springframework.data.domain.Pageable pageable);

        @EntityGraph(attributePaths = { "category", "department" })
        @org.springframework.data.jpa.repository.Query("SELECT i FROM InventoryItem i WHERE (LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.sku) LIKE LOWER(CONCAT('%', :search, '%'))) AND i.category.name = :category")
        Page<InventoryItem> findBySearchAndCategory(
                        @org.springframework.data.repository.query.Param("search") String search,
                        @org.springframework.data.repository.query.Param("category") String category,
                        org.springframework.data.domain.Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT SUM(i.price * i.stockQuantity) FROM InventoryItem i")
        Double sumValuation();

        @org.springframework.data.jpa.repository.Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.stockQuantity <= COALESCE(i.reorderLevel, 0) AND i.stockQuantity > 0")
        Long countLowStock();

        @org.springframework.data.jpa.repository.Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.stockQuantity <= 0")
        Long countOutOfStock();

        @org.springframework.data.jpa.repository.Query("SELECT i FROM InventoryItem i WHERE i.stockQuantity <= COALESCE(i.reorderLevel, 0)")
        List<InventoryItem> findItemsRequiringRestock();
}
