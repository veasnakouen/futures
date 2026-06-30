package com.mtp.billing.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

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
