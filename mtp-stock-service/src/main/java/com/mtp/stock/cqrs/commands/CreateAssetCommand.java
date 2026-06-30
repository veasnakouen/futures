package com.mtp.stock.cqrs.commands;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAssetCommand {
    @NotBlank(message = "Asset name is required")
    private String name;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotBlank(message = "Asset type is required")
    private String assetType;

    @NotBlank(message = "Status is required")
    private String status;

    private String imageUrl;
    
    private String vendor;
    private LocalDate purchaseDate;
    private Double purchaseCost;
    private LocalDate warrantyExpiryDate;
    private String assetCondition;
    private String barcode;
    private String location;
    
    private Boolean isReturnable = true;
    private Boolean isKit = false;
    private Boolean isIntangible = false;
    private Boolean isSubscription = false;
    private Boolean isActive = true;
    
    private LocalDate renewalDate;
    private String acquisitionType;
    private String donorOrPartnerName;
    private String costCenter;
    private Integer usefulLifeYears;
    
    private String productFamily;
    private String brand;
    private String modelNumber;
}
