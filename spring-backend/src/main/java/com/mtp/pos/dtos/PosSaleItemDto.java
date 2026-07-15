package com.mtp.pos.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PosSaleItemDto {
    private String id;
    private String productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private BigDecimal discount;
}
