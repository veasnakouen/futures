package com.mtp.hotel.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateGuestCommand {
    @NotBlank(message = "First name is required") private String firstName;
    @NotBlank(message = "Last name is required") private String lastName;
    private String email;
    private String phoneNumber;
    private String idProofNumber;
    private String address;
    private String nationality;
    private LocalDate dateOfBirth;
    private String emergencyContact;
}
