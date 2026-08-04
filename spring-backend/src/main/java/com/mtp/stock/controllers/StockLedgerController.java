package com.mtp.stock.controllers;

import com.mtp.stock.enums.StockLedgerType;
import com.mtp.stock.models.StockLedger;
import com.mtp.stock.services.StockLedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/stock/ledger")
@RequiredArgsConstructor
public class StockLedgerController {

    private final StockLedgerService stockLedgerService;

    @GetMapping
    public ResponseEntity<Page<StockLedger>> getLedgerHistory(
            @RequestParam(required = false) Long itemId,
            @RequestParam(required = false) StockLedgerType type,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(stockLedgerService.getLedgerHistory(itemId, type, search, pageable));
    }

    @PostMapping("/movement")
    public ResponseEntity<StockLedger> recordMovement(
            @RequestParam Long itemId,
            @RequestParam StockLedgerType type,
            @RequestParam Integer quantity,
            @RequestParam(required = false) Long sourceLocationId,
            @RequestParam(required = false) Long targetLocationId,
            @RequestParam(required = false) String referenceNumber,
            @RequestParam(required = false) String remarks,
            @RequestParam(required = false, defaultValue = "admin") String operator) {
        return ResponseEntity.ok(stockLedgerService.recordMovement(itemId, type, quantity, sourceLocationId, targetLocationId, referenceNumber, remarks, operator));
    }

    @PostMapping("/reserve")
    public ResponseEntity<Map<String, Object>> reserveStock(
            @RequestParam Long itemId,
            @RequestParam Integer quantity,
            @RequestParam(required = false) String referenceNumber,
            @RequestParam(required = false, defaultValue = "checkout") String operator) {
        return ResponseEntity.ok(stockLedgerService.reserveStock(itemId, quantity, referenceNumber, operator));
    }

    @PostMapping("/release")
    public ResponseEntity<Map<String, Object>> releaseReservation(
            @RequestParam String reservationKey,
            @RequestParam(required = false, defaultValue = "checkout") String operator) {
        return ResponseEntity.ok(stockLedgerService.releaseReservation(reservationKey, operator));
    }

    @PostMapping("/commit")
    public ResponseEntity<Map<String, Object>> commitReservation(
            @RequestParam String reservationKey,
            @RequestParam(required = false, defaultValue = "checkout") String operator) {
        return ResponseEntity.ok(stockLedgerService.commitReservation(reservationKey, operator));
    }
}
