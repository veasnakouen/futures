package com.mtp.stock.models;

import jakarta.persistence.*;
import com.mtp.stock.models.stubs.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "AssetInventoryImports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetInventoryImport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "AssetCode")
    private String assetCode;

    @Column(name = "Description", length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryId")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BrandId")
    private AssetBrand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SupplierId")
    private AssetSupplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DonorId")
    private AssetDonor donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DepartmentId")
    private DepartmentStub department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConditionId")
    private AssetCondition condition; // Quality

    @Column(name = "Model")
    private String model;

    @Column(name = "SerialNumber")
    private String serialNumber;

    @Column(name = "Specifications", length = 1000)
    private String specifications;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "UnitPrice")
    private Double unitPrice;

    @Column(name = "TotalPrice")
    private Double totalPrice;

    @Column(name = "Status")
    private String status; // Pending, Imported, Error

    @Column(name = "Location")
    private String location;

    @Column(name = "AssignedTo")
    private String assignedTo;

    @Column(name = "PurchaseDate")
    private LocalDate purchaseDate;

    @Column(name = "Remarks", length = 2000)
    private String remarks;

    @Column(name = "SheetName")
    private String sheetName;

    @Column(name = "TargetType")
    private String targetType; // ASSET or INVENTORY

    @Column(name = "ImportDate")
    private LocalDateTime importDate = LocalDateTime.now();

    @Column(name = "ErrorMessage", length = 2000)
    private String errorMessage;
}
