package com.mtp.stock.repositories;

import com.mtp.stock.enums.StockLedgerType;
import com.mtp.stock.models.StockLedger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockLedgerRepository extends JpaRepository<StockLedger, Long> {

    Page<StockLedger> findByItemIdOrderByCreatedAtDesc(Long itemId, Pageable pageable);

    Page<StockLedger> findByTransactionTypeOrderByCreatedAtDesc(StockLedgerType transactionType, Pageable pageable);

    Optional<StockLedger> findFirstByReservationKeyAndTransactionType(String reservationKey, StockLedgerType transactionType);

    @Query("SELECT s FROM StockLedger s WHERE " +
           "(:itemId IS NULL OR s.item.id = :itemId) AND " +
           "(:type IS NULL OR s.transactionType = :type) AND " +
           "(:search IS NULL OR LOWER(s.item.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.referenceNumber) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY s.createdAt DESC")
    Page<StockLedger> searchLedger(
            @Param("itemId") Long itemId,
            @Param("type") StockLedgerType type,
            @Param("search") String search,
            Pageable pageable);
}
