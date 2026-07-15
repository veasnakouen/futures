package com.mtp.billing.cqrs.commands;

import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import com.mtp.billing.enums.InvoiceStatus;
import com.mtp.billing.enums.ModuleSource;

@Data
public class CreateInvoiceCommand {
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
    private BigDecimal taxRate;
    private BigDecimal taxTotal;
    private BigDecimal promotionDiscount;
    private BigDecimal poorIdDiscount;
    private BigDecimal discountTotal;
    private BigDecimal grandTotal;

    private List<InvoiceLineItemCommand> lineItems;

    @Data
    public static class InvoiceLineItemCommand {
        private String itemCode;
        private String description;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
        private BigDecimal total;
    }
}
