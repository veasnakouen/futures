package com.mtp.clinic.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

import com.mtp.clinic.enums.AppointmentStatus;

@Data
public class AppointmentQueryResultDto {
    private String id;
    private String patientId;
    private String doctorId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private AppointmentStatus status;
    private String notes;
}
