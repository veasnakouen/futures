package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EducationDto {
    private Integer id;
    private Integer clientId;
    private String clientName;
    private String currentLevel;
    private String schoolName;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String grade;
    private String subject;
    private String year;
    private String description;
}
