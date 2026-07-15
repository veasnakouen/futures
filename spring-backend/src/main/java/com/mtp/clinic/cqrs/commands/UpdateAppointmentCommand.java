package com.mtp.clinic.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

import com.mtp.clinic.enums.AppointmentStatus;

@Data
public class UpdateAppointmentCommand {
    private String id;
    @NotNull(message = "Patient ID is required") private String patientId;
    @NotNull(message = "Doctor ID is required") private String doctorId;
    @NotNull(message = "Appointment Date is required") private LocalDate appointmentDate;
    @NotNull(message = "Appointment Time is required") private LocalTime appointmentTime;
    private AppointmentStatus status;
    private String notes;
}
