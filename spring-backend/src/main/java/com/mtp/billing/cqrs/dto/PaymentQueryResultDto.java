package com.mtp.billing.cqrs.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentQueryResultDto {
    private String id;
    private int amount;
    private LocalDate submitDate;
    private com.mtp.billing.enums.Status status;
    private int adjudicatedAmount;
    private String referenceId;
    private com.mtp.billing.enums.ModuleSource sourceModule;
}
