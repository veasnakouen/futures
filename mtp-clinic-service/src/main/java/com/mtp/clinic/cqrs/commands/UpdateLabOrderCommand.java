package com.mtp.clinic.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class UpdateLabOrderCommand {
    private String id;
    private String testName;
    private String loincCode;
    private com.mtp.clinic.enums.Status status;
    private String resultValue;
    private String referenceRange;
    private String abnormalFlag;
}
