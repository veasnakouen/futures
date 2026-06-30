package com.mtp.pos.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PosProductDto {
    private String id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal price;
    private Integer stockQuantity;
    private String category;
    private String barcode;
    private BigDecimal costPrice;
    private BigDecimal taxRate;
    private String status;
    private String imageUrl;
    private String unit;
    private String brand;
}
