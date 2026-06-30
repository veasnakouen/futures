package com.mtp.clinic.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreatePrescriptionCommand {
    private String patientId;
    private String diagnosis;
    private java.util.List<com.mtp.clinic.cqrs.dto.PrescriptionItemDto> items;
}
