package com.mtp.billing.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import com.mtp.billing.enums.InvoiceStatus;
import com.mtp.billing.enums.ModuleSource;

@Data
public class InvoiceQueryResultDto {
    private String id;
    private String invoiceNumber;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private InvoiceStatus status;
    private String referenceId;
    private ModuleSource sourceModule;
    
    private String headerText;
    private String footerText;
    
    private String paymentMethod;
    private String paymentLink;

    private BigDecimal subTotal;
    private BigDecimal taxTotal;
    private BigDecimal discountTotal;
    private BigDecimal grandTotal;

    private List<InvoiceLineItemDto> lineItems;

    @Data
    public static class InvoiceLineItemDto {
        private String id;
        private String itemCode;
        private String description;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
        private BigDecimal total;
    }
}
