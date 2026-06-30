package com.mtp.clinic.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

import com.mtp.clinic.enums.Gender;

@Data
public class PatientQueryResultDto {
    private String id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String contactNumber;
    private String medicalRecordNumber;
    private String bloodType;
    private AddressDto address;
    private Boolean isActive;
}
