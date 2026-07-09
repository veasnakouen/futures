package com.mtp.api.dto;

import lombok.Data;

@Data
public class TimetableDto {
    private Integer id;
    private String name;
    private String onDutyTime;
    private String offDutyTime;
    private Integer lateTime;
    private Integer leaveEarlyTime;
}
