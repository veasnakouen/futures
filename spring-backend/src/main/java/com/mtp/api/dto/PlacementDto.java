package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PlacementDto {
    private Integer id;
    private String countedTime;
    private Integer clientId;
    private String clientName;
    private LocalDateTime placementDate;
    private String placementType;
    private Integer jobPositionId;
    private String jobPositionName;
    private String companyName;
    private String salary;
    private String status;
}
