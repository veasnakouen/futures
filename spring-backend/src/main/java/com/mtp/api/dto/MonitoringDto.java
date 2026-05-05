package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MonitoringDto {
    private Integer id;
    private String monitoringTime;
    private String enroll;
    private String type;
    private Integer clientId;
    private String clientName;
    private LocalDateTime monitoringDate;
    private LocalDateTime nextMonitoringDate;
    private String monitoringtype;
}
