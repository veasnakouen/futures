package com.mtp.stock.services;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.models.ItemLocationStock;
import com.mtp.stock.models.Location;
import com.mtp.stock.repositories.InventoryRepository;
import com.mtp.stock.repositories.ItemLocationStockRepository;
import com.mtp.stock.repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class StockTransferService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ItemLocationStockRepository itemLocationStockRepository;

    @Autowired
    private FefoAllocationEngine fefoAllocationEngine;

    /**
     * Initializes stock for a new item at a specific location, increasing total inventory.
     */
    @Transactional
    public void addStockToLocation(Long itemId, Long locationId, Integer quantityToAdd) {
        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Item ID"));
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Location ID"));

        ItemLocationStock stock = itemLocationStockRepository.findByInventoryItemIdAndLocationId(itemId, locationId)
                .orElse(new ItemLocationStock(null, null, item, location, 0, 0, 0, LocalDateTime.now()));

        stock.setQuantity(stock.getQuantity() + quantityToAdd);
        stock.setLastUpdated(LocalDateTime.now());
        itemLocationStockRepository.save(stock);

        // Update global aggregated quantity to keep backward compatibility
        item.addStock(quantityToAdd);
        inventoryRepository.save(item);
    }

    /**
     * Allocates existing global stock to a specific location without increasing global total.
     */
    @Transactional
    public void allocateStockToLocation(Long itemId, Long locationId, Integer quantityToAllocate) {
        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Item ID"));
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Location ID"));

        ItemLocationStock stock = itemLocationStockRepository.findByInventoryItemIdAndLocationId(itemId, locationId)
                .orElse(new ItemLocationStock(null, null, item, location, 0, 0, 0, LocalDateTime.now()));

        stock.setQuantity(stock.getQuantity() + quantityToAllocate);
        stock.setLastUpdated(LocalDateTime.now());
        itemLocationStockRepository.save(stock);
    }

    /**
     * Deducts stock from a specific location (e.g., when consumed by a service).
     */
    @Transactional
    public void consumeStockFromLocation(Long itemId, Long locationId, Integer quantityToConsume) {
        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Item ID"));
        
        ItemLocationStock stock = itemLocationStockRepository.findByInventoryItemIdAndLocationId(itemId, locationId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found at this location"));

        if (stock.getQuantity() < quantityToConsume) {
            throw new IllegalStateException("Insufficient stock at location");
        }

        stock.setQuantity(stock.getQuantity() - quantityToConsume);
        stock.setLastUpdated(LocalDateTime.now());
        itemLocationStockRepository.save(stock);

        // Update global aggregated quantity
        item.removeStock(quantityToConsume);
        inventoryRepository.save(item);
        
        // Trigger FEFO engine to accurately deduct from specific batches
        fefoAllocationEngine.executeFefoDeduction(itemId, quantityToConsume);
    }

    /**
     * Transfers stock between two internal locations without affecting total aggregated quantity.
     */
    @Transactional
    public void transferStock(Long itemId, Long sourceLocationId, Long targetLocationId, Integer quantityToTransfer) {
        if (sourceLocationId.equals(targetLocationId)) {
            throw new IllegalArgumentException("Source and target locations must be different");
        }

        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Item ID"));

        Location targetLocation = locationRepository.findById(targetLocationId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Target Location ID"));

        ItemLocationStock sourceStock = itemLocationStockRepository.findByInventoryItemIdAndLocationId(itemId, sourceLocationId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found at source location"));

        if (sourceStock.getQuantity() < quantityToTransfer) {
            throw new IllegalStateException("Insufficient stock at source location");
        }

        ItemLocationStock targetStock = itemLocationStockRepository.findByInventoryItemIdAndLocationId(itemId, targetLocationId)
                .orElse(new ItemLocationStock(null, null, item, targetLocation, 0, 0, 0, LocalDateTime.now()));

        // Deduct from source
        sourceStock.setQuantity(sourceStock.getQuantity() - quantityToTransfer);
        sourceStock.setLastUpdated(LocalDateTime.now());
        itemLocationStockRepository.save(sourceStock);

        // Add to target
        targetStock.setQuantity(targetStock.getQuantity() + quantityToTransfer);
        targetStock.setLastUpdated(LocalDateTime.now());
        itemLocationStockRepository.save(targetStock);
    }

    /**
     * Adjusts stock directly to a new quantity, syncing the difference with global inventory.
     */
    @Transactional
    public void adjustLocationStock(Long itemId, Long locationId, Integer newQuantity) {
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Item ID"));
        
        ItemLocationStock stock = itemLocationStockRepository.findByInventoryItemIdAndLocationId(itemId, locationId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found at this location"));

        int difference = newQuantity - stock.getQuantity();
        
        stock.setQuantity(newQuantity);
        stock.setLastUpdated(LocalDateTime.now());
        itemLocationStockRepository.save(stock);

        // Update global aggregated quantity to keep in sync
        if (difference > 0) {
            item.addStock(difference);
        } else if (difference < 0) {
            item.removeStock(Math.abs(difference));
        }
        inventoryRepository.save(item);
    }

    /**
     * Removes all stock of an item from a location, unallocating it.
     */
    @Transactional
    public void removeStockFromLocation(Long itemId, Long locationId) {
        ItemLocationStock stock = itemLocationStockRepository.findByInventoryItemIdAndLocationId(itemId, locationId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found at this location"));
        
        itemLocationStockRepository.delete(stock);
        // Note: Global inventory is unchanged, meaning the stock becomes "unallocated" and available again.
    }
}
