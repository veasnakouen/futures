package com.mtp.clinic.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PrescriptionQueryResultDto {
    private String id;
    private String patientId;
    private String diagnosis;
    private java.util.List<PrescriptionItemDto> items;
}
