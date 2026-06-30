package com.mtp.api.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
public class VacancyDto {
    private Integer id;
    private LocalDateTime postingDate;
    private LocalDateTime deadline;
    private String closingDate;   // ISO date string "2024-01-01" from frontend

    @NotNull(message = "Employer is required")
    private Integer employerId;
    private String employerName;

    @NotNull(message = "Job position is required")
    private Integer jobPositionId;
    private String jobPositionName;

    private Integer jobCategoryId;
    private String jobCategoryName;

    @Min(value = 1, message = "At least one position must be available")
    private int positionAvailable;

    @NotBlank(message = "Contract type is required")
    private String contractType;

    private String salary;

    @NotBlank(message = "Status is required")
    private String status;
    private String imageUrl;
    
    // Additional UI fields
    private String responsibilities;
    private String requirement;
    private String applicationInformation;
    private String schedule;
    private String location;
    private String salarymax;
}
