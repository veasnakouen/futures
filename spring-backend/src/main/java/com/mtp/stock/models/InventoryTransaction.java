package com.mtp.stock.models;

import com.mtp.stock.enums.InventoryTransactionType;
import jakarta.persistence.*;
import com.mtp.stock.models.stubs.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "InventoryTransactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ItemId", nullable = false)
    private InventoryItem item;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InventoryTransactionType type;

    @Column(nullable = false)
    private Integer quantity; // Positive for IN, Negative for OUT

    private Double unitPrice; // Purchase price or Sale price at time of transaction

    private Double totalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SupplierId")
    private AssetSupplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DonorId")
    private AssetDonor donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RetailerId")
    private InventoryRetailer retailer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerId")
    private InventoryCustomer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DepartmentId")
    private DepartmentStub department; // For internal transfers

    @Column(name = "ReferenceNumber")
    private String referenceNumber; // Invoice #, Receipt #, etc.

    @Column(length = 1000)
    private String remarks;

    private LocalDateTime transactionDate = LocalDateTime.now();

    @Column(name = "CreatedBy")
    private String createdBy;
}
