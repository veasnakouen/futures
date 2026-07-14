package com.mtp.stock.services;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.models.InventoryTransaction;
import com.mtp.stock.repositories.InventoryRepository;
import com.mtp.stock.repositories.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;
    private final InventoryRepository itemRepository;

    @Transactional
    public InventoryTransaction recordTransaction(InventoryTransaction transaction) {
        InventoryItem item = transaction.getItem();
        
        // Calculate total price if not provided
        if (transaction.getTotalPrice() == null && transaction.getUnitPrice() != null) {
            transaction.setTotalPrice(transaction.getUnitPrice() * Math.abs(transaction.getQuantity()));
        }

        // Update real-time quantity in InventoryItem using domain method
        if (transaction.getQuantity() > 0) {
            item.addStock(transaction.getQuantity());
        } else if (transaction.getQuantity() < 0) {
            item.removeStock(Math.abs(transaction.getQuantity()));
        }
        
        // If it's a purchase, update the cost price
        if (transaction.getType().name().contains("PURCHASE") || transaction.getType().name().contains("IN")) {
            if (transaction.getUnitPrice() != null) {
                item.setCostPrice(BigDecimal.valueOf(transaction.getUnitPrice()));
            }
        }

        itemRepository.save(item);
        return transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public java.util.List<InventoryTransaction> getTransactionsByItem(Long itemId) {
        return transactionRepository.findByItemIdOrderByTransactionDateDesc(itemId);
    }
}
