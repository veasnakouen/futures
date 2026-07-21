package com.mtp.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkShiftScheduleDto {
    private Integer departmentId;
    private Integer scheduleYear;
    private String janShift;
    private String febShift;
    private String marShift;
    private String aprShift;
    private String mayShift;
    private String junShift;
    private String julShift;
    private String augShift;
    private String sepShift;
    private String octShift;
    private String novShift;
    private String decShift;
}
