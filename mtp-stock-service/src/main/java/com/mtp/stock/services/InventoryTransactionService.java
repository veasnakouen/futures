package com.mtp.stock.services;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.models.InventoryTransaction;
import com.mtp.stock.repositories.InventoryRepository;
import com.mtp.stock.repositories.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;
    private final InventoryRepository itemRepository; // Assuming this is the repo for InventoryItem

    @Transactional
    public InventoryTransaction recordTransaction(InventoryTransaction transaction) {
        InventoryItem item = transaction.getItem();
        
        // Calculate total price if not provided
        if (transaction.getTotalPrice() == null && transaction.getUnitPrice() != null) {
            transaction.setTotalPrice(transaction.getUnitPrice() * Math.abs(transaction.getQuantity()));
        }

        // Update real-time quantity in InventoryItem
        int currentQty = item.getQuantity() != null ? item.getQuantity() : 0;
        item.setQuantity(currentQty + transaction.getQuantity());
        
        // If it's a purchase, update the last restock date and cost price
        if (transaction.getType().name().contains("PURCHASE") || transaction.getType().name().contains("IN")) {
            item.setLastRestockDate(transaction.getTransactionDate());
            if (transaction.getUnitPrice() != null) {
                item.setCostPrice(transaction.getUnitPrice());
            }
        }

        itemRepository.save(item);
        return transactionRepository.save(transaction);
    }
}
