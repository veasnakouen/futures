package com.mtp.stock.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "InventoryItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.NotBlank(message = "Item name is required")
    @jakarta.validation.constraints.Size(max = 255, message = "Name cannot exceed 255 characters")
    private String name;

    @jakarta.validation.constraints.Size(max = 50, message = "SKU cannot exceed 50 characters")
    private String sku;

    private String category;

    @jakarta.validation.constraints.NotNull(message = "Quantity is required")
    @jakarta.validation.constraints.Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    private String unit;

    @jakarta.validation.constraints.Min(value = 0, message = "Minimum quantity cannot be negative")
    private Integer minQuantity;

    private Double costPrice;

    private Double salePrice;

    @jakarta.validation.constraints.DecimalMin(value = "0.0", message = "Unit price cannot be negative")
    private Double unitPrice;

    private String location;

    private String status;

    @jakarta.validation.constraints.Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private LocalDateTime lastRestockDate;

    // --- Enterprise WMS Fields ---

    // Supply Chain
    private String vendor;
    private Integer maxQuantity;
    private Integer leadTimeDays;

    // Logistics
    private String binLocation;
    private Double weight;
    private String dimensions;

    // Traceability
    private String batchNumber;
    private String barcode;
    private LocalDate expirationDate;

    // --- HR & Internal Controls ---
    private Boolean isReturnable = false;
    private Boolean isKit = false;
    private Boolean isIntangible = false;
    private Boolean isSubscription = false;
    private Boolean isActive = true;

    private LocalDate renewalDate;

    // --- Cost & Ownership ---
    private String acquisitionType; // Purchased, Donated, Leased
    private String donorOrPartnerName;
    private String costCenter;
    private Integer usefulLifeYears;

    // --- Categorization ---
    private String productFamily;
    private String brand;
    private String modelNumber;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String imageUrl;
}
