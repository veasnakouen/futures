package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PlacementMonitoringDto {
    // PlacementProgress fields
    private Integer id;
    // private Boolean completed;
    private String completed;
    private String placementStatus;
    private String salary;
    private String note;

    // Monitoring fields
    private Integer monitoringId;
    private String monitoringTime;
    private String enroll;
    private String type;
    private Integer clientId;
    private String clientName;
    private LocalDateTime monitoringDate;
    private LocalDateTime nextMonitoringDate;
    private String monitoringtype;
    private Integer placementId;
}
