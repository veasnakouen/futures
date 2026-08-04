package com.mtp.stock.models;

import com.mtp.stock.enums.StockLedgerType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "StockLedgers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ItemId", nullable = false)
    private InventoryItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SourceLocationId")
    private Location sourceLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TargetLocationId")
    private Location targetLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "TransactionType", nullable = false)
    private StockLedgerType transactionType;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "BalanceBefore")
    private Integer balanceBefore;

    @Column(name = "BalanceAfter")
    private Integer balanceAfter;

    @Column(name = "ReservationKey")
    private String reservationKey;

    @Column(name = "ReferenceNumber")
    private String referenceNumber;

    @Column(length = 1000)
    private String remarks;

    @Column(name = "CreatedBy")
    private String createdBy;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
