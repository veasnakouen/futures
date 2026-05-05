package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VacancyDto {
    private Integer id;
    private LocalDateTime postingDate;
    private LocalDateTime deadline;
    private String closingDate;   // ISO date string "2024-01-01" from frontend
    private Integer employerId;
    private String employerName;
    private Integer jobPositionId;
    private String jobPositionName;
    private Integer jobCategoryId;
    private String jobCategoryName;
    private int positionAvailable;
    private String contractType;
    private String salary;
    private String status;
    private String imageUrl;
}

