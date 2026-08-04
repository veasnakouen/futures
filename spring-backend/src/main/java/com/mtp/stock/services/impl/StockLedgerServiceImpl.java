package com.mtp.stock.services.impl;

import com.mtp.stock.enums.StockLedgerType;
import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.models.Location;
import com.mtp.stock.models.StockLedger;
import com.mtp.stock.repositories.InventoryRepository;
import com.mtp.stock.repositories.LocationRepository;
import com.mtp.stock.repositories.StockLedgerRepository;
import com.mtp.stock.services.StockLedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StockLedgerServiceImpl implements StockLedgerService {

    private final StockLedgerRepository ledgerRepository;
    private final InventoryRepository inventoryRepository;
    private final LocationRepository locationRepository;

    @Override
    public Page<StockLedger> getLedgerHistory(Long itemId, StockLedgerType type, String search, Pageable pageable) {
        return ledgerRepository.searchLedger(itemId, type, search, pageable);
    }

    @Override
    @Transactional
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public StockLedger recordMovement(Long itemId, StockLedgerType type, Integer quantity, Long sourceLocationId, Long targetLocationId, String referenceNumber, String remarks, String operator) {
        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found: " + itemId));

        int balanceBefore = item.getStockQuantity() != null ? item.getStockQuantity() : 0;
        int balanceAfter = balanceBefore;

        if (type == StockLedgerType.STOCK_IN || type == StockLedgerType.RESERVATION_RELEASE) {
            balanceAfter += Math.abs(quantity);
        } else if (type == StockLedgerType.STOCK_OUT || type == StockLedgerType.RESERVATION_LOCK) {
            if (balanceBefore < Math.abs(quantity)) {
                throw new IllegalStateException("Insufficient stock balance. Available: " + balanceBefore + ", Requested: " + Math.abs(quantity));
            }
            balanceAfter -= Math.abs(quantity);
        } else if (type == StockLedgerType.ADJUSTMENT) {
            balanceAfter = quantity; // Absolute set for direct adjustment
        }

        item.setStockQuantity(balanceAfter);
        inventoryRepository.save(item);

        StockLedger ledger = new StockLedger();
        ledger.setItem(item);
        ledger.setTransactionType(type);
        ledger.setQuantity(quantity);
        ledger.setBalanceBefore(balanceBefore);
        ledger.setBalanceAfter(balanceAfter);
        ledger.setReferenceNumber(referenceNumber != null ? referenceNumber : "REF-" + System.currentTimeMillis() % 100000);
        ledger.setRemarks(remarks);
        ledger.setCreatedBy(operator != null ? operator : "system");

        if (sourceLocationId != null) {
            locationRepository.findById(sourceLocationId).ifPresent(ledger::setSourceLocation);
        }
        if (targetLocationId != null) {
            locationRepository.findById(targetLocationId).ifPresent(ledger::setTargetLocation);
        }

        return ledgerRepository.save(ledger);
    }

    @Override
    @Transactional
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public Map<String, Object> reserveStock(Long itemId, Integer quantity, String referenceNumber, String operator) {
        String reservationKey = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        StockLedger ledger = recordMovement(itemId, StockLedgerType.RESERVATION_LOCK, quantity, null, null, referenceNumber, "Checkout Stock Reservation Lock", operator);
        ledger.setReservationKey(reservationKey);
        ledgerRepository.save(ledger);

        Map<String, Object> result = new HashMap<>();
        result.put("reservationKey", reservationKey);
        result.put("status", "RESERVED");
        result.put("quantity", quantity);
        result.put("itemId", itemId);
        return result;
    }

    @Override
    @Transactional
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public Map<String, Object> releaseReservation(String reservationKey, String operator) {
        StockLedger lock = ledgerRepository.findFirstByReservationKeyAndTransactionType(reservationKey, StockLedgerType.RESERVATION_LOCK)
                .orElseThrow(() -> new IllegalArgumentException("Reservation lock not found: " + reservationKey));

        StockLedger release = recordMovement(lock.getItem().getId(), StockLedgerType.RESERVATION_RELEASE, lock.getQuantity(), null, null, lock.getReferenceNumber(), "Released Stock Reservation Lock", operator);
        release.setReservationKey(reservationKey);
        ledgerRepository.save(release);

        Map<String, Object> result = new HashMap<>();
        result.put("reservationKey", reservationKey);
        result.put("status", "RELEASED");
        result.put("releasedQuantity", lock.getQuantity());
        return result;
    }

    @Override
    @Transactional
    @CacheEvict(value = { "dashboardStats", "inventory" }, allEntries = true)
    public Map<String, Object> commitReservation(String reservationKey, String operator) {
        StockLedger lock = ledgerRepository.findFirstByReservationKeyAndTransactionType(reservationKey, StockLedgerType.RESERVATION_LOCK)
                .orElseThrow(() -> new IllegalArgumentException("Reservation lock not found: " + reservationKey));

        StockLedger commit = new StockLedger();
        commit.setItem(lock.getItem());
        commit.setTransactionType(StockLedgerType.STOCK_OUT);
        commit.setQuantity(lock.getQuantity());
        commit.setBalanceBefore(lock.getItem().getStockQuantity());
        commit.setBalanceAfter(lock.getItem().getStockQuantity());
        commit.setReservationKey(reservationKey);
        commit.setReferenceNumber(lock.getReferenceNumber());
        commit.setRemarks("Committed Sales Checkout Stock Output");
        commit.setCreatedBy(operator != null ? operator : "system");

        ledgerRepository.save(commit);

        Map<String, Object> result = new HashMap<>();
        result.put("reservationKey", reservationKey);
        result.put("status", "COMMITTED");
        result.put("committedQuantity", lock.getQuantity());
        return result;
    }
}
