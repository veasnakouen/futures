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

    private LocalDateTime dateOfBirth;

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

    private String relativePhone;

    private String maritalStatus;

    private String address;

    private String province;

    private String idCard;

    private String currentSituation;

    private boolean furtherEducation;

    private boolean placement;

    private boolean trainingFromFutures;

    private boolean socialSupportRequired;

    private String hearBy;

    private String expectedSupport;

    private String placeOfBirth;
    private String nationality;
    private String citizenship;
    private String height;
    private String weight;
    private String socialSupportProblem;

    private String idpoorStatus;
    private LocalDateTime idpoorValiddate;
    private String idpoorLevel;
    private String idpoorAccountNumber;

    private LocalDateTime registerDate;

    private String photoIdAttachment;
    private String contractAttachment;
    private String idPoorAttachment;
    private String cvAttachment;
    private String customFields;

    // Display name helper
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
