package com.mtp.stock.models;

import jakarta.persistence.*;
import com.mtp.stock.models.stubs.*;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "CompanyAssets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @jakarta.validation.constraints.NotBlank(message = "Asset name is required")
    private String name;

    @jakarta.validation.constraints.NotBlank(message = "Serial number is required")
    @Column(unique = true)
    private String serialNumber;

    @jakarta.validation.constraints.NotBlank(message = "Asset type is required")
    private String assetType; // Laptop, Mobile, Monitor, etc.

    @jakarta.validation.constraints.NotBlank(message = "Status is required")
    private String status; // Assigned, Available, Maintenance, Lost

    @Column(columnDefinition = "varchar(max)")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId")
    private EmployeeStub employee;

    private LocalDateTime assignedDate;

    // Enterprise Tracking Fields
    private String vendor;
    private LocalDate purchaseDate;
    private Double purchaseCost;
    private LocalDate warrantyExpiryDate;
    private String assetCondition; // e.g., New, Good, Fair, Poor
    private String barcode;
    private String location;
    // --- HR & Internal Controls ---
    private Boolean isReturnable = true;
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

    private LocalDateTime createdAt = LocalDateTime.now();
}
