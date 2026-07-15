package com.mtp.clinic.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class UpdateMedicalRecordCommand {
    private String id;
    @NotNull(message = "Patient ID is required") private String patientId;
    @NotNull(message = "Doctor ID is required") private String doctorId;
    private LocalDate recordDate;
    @NotBlank(message = "Diagnosis is required") private String diagnosis;
    private String treatment;
    private String prescription;
}
