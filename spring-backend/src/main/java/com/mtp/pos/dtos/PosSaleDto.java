package com.mtp.pos.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PosSaleDto {
    private String id;
    private String cashierId;
    private String paymentMethod;
    private BigDecimal totalAmount;
    private String receiptNumber;
    private LocalDateTime transactionDate;
    private java.util.List<PosSaleItemDto> items;
}
