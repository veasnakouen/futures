package com.mtp.stock.services;

import com.mtp.stock.models.StockBatch;
import com.mtp.stock.repositories.StockBatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FefoAllocationEngine {

    private final StockBatchRepository stockBatchRepository;

    public FefoAllocationEngine(StockBatchRepository stockBatchRepository) {
        this.stockBatchRepository = stockBatchRepository;
    }

    /**
     * Executes First-Expired, First-Out (FEFO) logic to deduct stock from the batches that expire soonest.
     *
     * @param inventoryItemId The ID of the item being consumed.
     * @param quantityToConsume The total quantity to consume.
     */
    @Transactional
    public void executeFefoDeduction(Long inventoryItemId, int quantityToConsume) {
        if (quantityToConsume <= 0) return;

        // Fetches all batches for this item, sorted by expiration date ascending (soonest to expire first)
        List<StockBatch> batches = stockBatchRepository.findByInventoryItemIdOrderByExpirationDateAsc(inventoryItemId);

        int remainingToConsume = quantityToConsume;

        for (StockBatch batch : batches) {
            if (remainingToConsume <= 0) break;

            int batchQty = batch.getQuantityInStock() != null ? batch.getQuantityInStock() : 0;
            if (batchQty > 0) {
                if (batchQty >= remainingToConsume) {
                    // This batch has enough to fulfill the rest of the requirement
                    batch.setQuantityInStock(batchQty - remainingToConsume);
                    stockBatchRepository.save(batch);
                    remainingToConsume = 0;
                } else {
                    // Consume the entire batch and move to the next one
                    remainingToConsume -= batchQty;
                    batch.setQuantityInStock(0);
                    stockBatchRepository.save(batch);
                }
            }
        }

        if (remainingToConsume > 0) {
            // Note: In a strict system, throwing an exception here might be appropriate. 
            // However, global inventory quantity might have been verified by the caller, 
            // meaning we just don't have enough tracked batches to cover it.
            // We proceed without throwing to allow unbatched consumption to still succeed.
        }
    }
}
