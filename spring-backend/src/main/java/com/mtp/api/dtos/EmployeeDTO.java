package com.mtp.api.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EmployeeDTO {
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name cannot exceed 100 characters")
    private String firstNameEnglish;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name cannot exceed 100 characters")
    private String lastNameEnglish;

    private String firstNameKhmer;
    private String lastNameKhmer;

    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "ID number is required")
    private String idNo;

    private String status;
    private String position;
    private String department;

    @DecimalMin(value = "0.0", message = "Salary cannot be negative")
    private Double basicSalary;

    private String gender;
    private String dateOfBirth;

    @Pattern(regexp = "^(\\+?[0-9\\s\\-\\.\\(\\)]{0,30})$", message = "Invalid phone number format")
    private String phoneNumber;

    private String address;
    private String joinDate;
    private String contractType;
    private String bankName;
    private String bankAccountNumber;
    private String emergencyContactName;
    private String emergencyContact;

    @Pattern(regexp = "^(\\+?[0-9\\s\\-\\.\\(\\)]{0,30})$", message = "Invalid emergency phone number format")
    private String emergencyContactPhone;

    private String photo;
    private Object customFields;

    private String title;
    private String placeOfBirth;
    private String country;
    private String nationality;
    private String bloodGroup;
    private String contractStartDate;
    private String contractEndDate;
    private String probationEndDate;
    private String manager;
    private String maritalStatus;
    private String children;
    private String identityCardNumber;
    private String identityCardType;
    private String note;
    private String biometricStatus;
    private String biometricId;

    private String photoIdAttachment;
    private String contractAttachment;
    private String idPoorAttachment;
    private String cvAttachment;
}
