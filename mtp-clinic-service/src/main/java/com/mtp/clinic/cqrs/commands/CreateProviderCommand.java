package com.mtp.clinic.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateProviderCommand {
    @NotBlank(message = "First name is required") private String firstName;
    @NotBlank(message = "Last name is required") private String lastName;
    @NotBlank(message = "Specialization is required") private String specialization;
    @NotBlank(message = "Contact number is required")
    private String contactNumber;
    @NotBlank(message = "Email is required")
    @Email
    private String email;
    private String licenseNumber;
    private Integer yearOfExperience;
    private String npiNumber;
    private Double consultationFee;
    private String employeeId;
    @NotBlank(message = "Role is required")
    private String role;
    private LocalDate hiredDate;
    private LocalDate terminationDate;
    private String shift;
}
