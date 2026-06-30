package com.mtp.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationDto {
    private Integer id;
    private Integer clientId;
    private Integer vacancyId;
    private LocalDateTime appliedDate;
    private String status;
    private String coverLetter;
    private String cvUrl;
    
    // Additional helpful fields for UI
    private String clientName;
    private String clientEmail;
    private String vacancyTitle;
    private String employerName;
}
