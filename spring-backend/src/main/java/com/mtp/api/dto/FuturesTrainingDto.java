package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FuturesTrainingDto {
    private Integer id;
    private Integer clientId;
    private String clientName;
    private Integer subjectId;
    private String subjectName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
}
