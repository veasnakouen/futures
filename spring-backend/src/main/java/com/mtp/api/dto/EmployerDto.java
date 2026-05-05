package com.mtp.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EmployerDto {
    private Integer id;

    @NotBlank(message = "Company name is required")
    @Size(max = 200, message = "Company name cannot exceed 200 characters")
    private String name;

    private Integer jobCategoryId;
    private String jobCategoryName;

    @Size(max = 500, message = "Address too long")
    private String address;

    @Size(max = 150, message = "Contact person name too long")
    private String contactPerson;

    @Pattern(regexp = "^(\\+?[0-9\\s\\-]{7,20})?$", message = "Invalid phone number format")
    private String contactPhone;

    @Email(message = "Invalid email format")
    private String email;

    private String website;
    private String branch;
    private String status;
    private String logoUrl;
}
