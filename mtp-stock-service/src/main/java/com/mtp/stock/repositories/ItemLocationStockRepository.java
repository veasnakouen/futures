package com.mtp.stock.repositories;

import com.mtp.stock.models.ItemLocationStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemLocationStockRepository extends JpaRepository<ItemLocationStock, Long> {
    List<ItemLocationStock> findByInventoryItemId(Long inventoryItemId);
    List<ItemLocationStock> findByLocationId(Long locationId);
    Optional<ItemLocationStock> findByInventoryItemIdAndLocationId(Long inventoryItemId, Long locationId);
}
