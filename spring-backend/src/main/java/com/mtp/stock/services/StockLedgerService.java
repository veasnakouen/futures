package com.mtp.stock.services;

import com.mtp.stock.enums.StockLedgerType;
import com.mtp.stock.models.StockLedger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface StockLedgerService {
    Page<StockLedger> getLedgerHistory(Long itemId, StockLedgerType type, String search, Pageable pageable);
    StockLedger recordMovement(Long itemId, StockLedgerType type, Integer quantity, Long sourceLocationId, Long targetLocationId, String referenceNumber, String remarks, String operator);
    Map<String, Object> reserveStock(Long itemId, Integer quantity, String referenceNumber, String operator);
    Map<String, Object> releaseReservation(String reservationKey, String operator);
    Map<String, Object> commitReservation(String reservationKey, String operator);
}
