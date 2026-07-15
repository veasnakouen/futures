package com.mtp.clinic.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import com.mtp.clinic.cqrs.dto.PrescriptionItemDto;

@Data
public class CreatePrescriptionCommand {
    private String patientId;
    private String diagnosis;
    private List<PrescriptionItemDto> items;
}
