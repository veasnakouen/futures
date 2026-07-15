package com.mtp.clinic.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class PrescriptionQueryResultDto {
    private String id;
    private String patientId;
    private String diagnosis;
    private List<PrescriptionItemDto> items;
}
