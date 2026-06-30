package com.mtp.stock.cqrs.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
public class AssetQueryResultDto {
    private Integer id;
    private String name;
    private String serialNumber;
    private String assetType;
    private String status;
    private String imageUrl;
    
    // Minimal employee info
    private Integer employeeId;
    private String employeeName;
    
    private LocalDateTime assignedDate;
    private String vendor;
    private LocalDate purchaseDate;
    private Double purchaseCost;
    private LocalDate warrantyExpiryDate;
    private String assetCondition;
    private String barcode;
    private String location;
    
    private Boolean isReturnable;
    private Boolean isKit;
    private Boolean isIntangible;
    private Boolean isSubscription;
    private Boolean isActive;
    
    private LocalDate renewalDate;
    private String acquisitionType;
    private String donorOrPartnerName;
    private String costCenter;
    private Integer usefulLifeYears;
    private String productFamily;
    private String brand;
    private String modelNumber;
    private LocalDateTime createdAt;
}
