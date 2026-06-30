package com.mtp.clinic.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MedicalRecordQueryResultDto {
    private String id;
    private String patientId;
    private String doctorId;
    private LocalDate recordDate;
    private String diagnosis;
    private String treatment;
    private String prescription;
}
