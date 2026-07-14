package com.mtp.stock.repositories;

import com.mtp.stock.models.ItemLocationStock;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// @Repository
public interface ItemLocationStockRepository extends JpaRepository<ItemLocationStock, Long> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "inventoryItem", "inventoryItem.category",
            "inventoryItem.department", "location" })
    List<ItemLocationStock> findByInventoryItemId(Long inventoryItemId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "inventoryItem", "inventoryItem.category",
            "inventoryItem.department", "location" })
    List<ItemLocationStock> findByLocationId(Long locationId);

    Optional<ItemLocationStock> findByInventoryItemIdAndLocationId(Long inventoryItemId, Long locationId);
}
