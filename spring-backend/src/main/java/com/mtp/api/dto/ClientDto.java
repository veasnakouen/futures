package com.mtp.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClientDto {
    private Integer id;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name cannot exceed 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name cannot exceed 100 characters")
    private String lastName;

    private String gender;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotBlank(message = "Client code is required")
    private String clientCode;

    private String photo; // Base64 — size controlled at Tomcat level

    private String status;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^(\\+?[0-9\\s\\-]{7,20})?$", message = "Invalid phone number format")
    private String contactPhone;

    private LocalDateTime registerDate;

    // Display name helper
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
