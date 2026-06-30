package com.mtp.clinic.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProviderQueryResultDto {
    private String id;
    private String firstName;
    private String lastName;
    private String specialization;
    private String contactNumber;
    private String email;
    private Boolean isActive;
    private String licenseNumber;
    private Integer yearOfExperience;
    private String npiNumber;
    private Double consultationFee;
    private String employeeId;
    private String role;
    private LocalDate hiredDate;
    private LocalDate terminationDate;
    private String shift;
}
