package com.mtp.stock.repositories;

import com.mtp.stock.models.StockBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockBatchRepository extends JpaRepository<StockBatch, String> {
    List<StockBatch> findByInventoryItemIdOrderByExpirationDateAsc(Long inventoryItemId);
}
