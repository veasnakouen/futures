package com.mtp.stock.repositories;

import com.mtp.stock.models.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByItemIdOrderByTransactionDateDesc(Long itemId);
}
