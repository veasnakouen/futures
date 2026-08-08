package com.mtp.stock.repositories;

import com.mtp.stock.models.InventoryRetailer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRetailerRepository extends JpaRepository<InventoryRetailer, Integer> {
}
