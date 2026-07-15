package com.mtp.hotel.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateGuestCommand {
    private Integer id;
    @NotBlank(message = "First name is required") private String firstName;
    @NotBlank(message = "Last name is required") private String lastName;
    @Email(message = "Invalid email format") @NotBlank(message = "Email is required") private String email;
    private String phoneNumber;
    private String idProofNumber;
    private String address;
    private Boolean isActive;
    private String nationality;
    private LocalDate dateOfBirth;
    private String emergencyContact;
}
