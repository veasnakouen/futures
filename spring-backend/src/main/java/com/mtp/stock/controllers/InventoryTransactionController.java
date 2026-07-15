package com.mtp.stock.controllers;

import com.mtp.stock.models.InventoryTransaction;
import com.mtp.stock.services.InventoryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock/inventory/transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService transactionService;

    @PostMapping
    public ResponseEntity<InventoryTransaction> createTransaction(@RequestBody InventoryTransaction transaction) {
        return ResponseEntity.ok(transactionService.recordTransaction(transaction));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<java.util.List<InventoryTransaction>> getTransactionsByItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(transactionService.getTransactionsByItem(itemId));
    }
}
