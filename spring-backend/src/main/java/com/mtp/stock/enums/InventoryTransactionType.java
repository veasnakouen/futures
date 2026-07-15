package com.mtp.stock.enums;

public enum InventoryTransactionType {
    PURCHASE, // Buy for shop/org
    SALE, // Sell in shop
    DONATION_IN, // Receive donation
    DONATION_OUT, // Give as donation
    TRANSFER_IN, // Receive from another branch/dept
    TRANSFER_OUT, // Move to another branch/dept
    ADJUSTMENT, // Manual correction (lost, damaged, etc.)
    RETURN // Customer or Supplier return
}

// public enum Gender{
// Male,
// Female,
// Other,
// }