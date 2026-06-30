package com.mtp.stock.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AssetImportDto {
    private String assetCode;
    private String description;
    private String category;
    private String brand;
    private String model;
    private String serialNumber;
    private String specifications;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
    private String itemCondition;
    private String location;
    private String assignedTo;
    private LocalDate purchaseDate;
    private String supplier;
    private String remarks;
    private String sheetName;
    private String targetType;
}
