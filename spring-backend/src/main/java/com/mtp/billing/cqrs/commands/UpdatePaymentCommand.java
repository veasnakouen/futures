package com.mtp.billing.cqrs.commands;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdatePaymentCommand {
    private String id;
    private int amount;
    private LocalDate submitDate;
    private com.mtp.billing.enums.Status status;
    private int adjudicatedAmount;
    private String referenceId;
    private com.mtp.billing.enums.ModuleSource sourceModule;
}
