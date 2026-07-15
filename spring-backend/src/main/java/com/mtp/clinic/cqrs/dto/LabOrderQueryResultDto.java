package com.mtp.clinic.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class LabOrderQueryResultDto {
    private String id;
    private String testName;
    private String loincCode;
    private com.mtp.clinic.enums.Status status;
    private String resultValue;
    private String referenceRange;
    private String abnormalFlag;
}
