package com.mtp.clinic.cqrs.commands;

import com.mtp.clinic.cqrs.dto.AddressDto;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

import com.mtp.clinic.enums.Gender;

@Data
public class CreatePatientCommand {
    @NotBlank(message = "First name is required") private String firstName;
    @NotBlank(message = "Last name is required") private String lastName;
    @NotNull(message = "Date of birth is required") private LocalDate dateOfBirth;
    private Gender gender;
    private String poorId;
    private String contactNumber;
    private String medicalRecordNumber;
    private String bloodType;
    private AddressDto address;
}
