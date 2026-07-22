package com.mtp.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftScheduleDto {
    private Integer id;
    private String employeeId; // Using employeeId (e.g., EMP-001) or Integer DB id. Let's use String since the UI passes EMP-001
    private String employeeName;
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

    // Planned Annual Leave days from AnnualLeavePlan
    private Double janAlDays;
    private Double febAlDays;
    private Double marAlDays;
    private Double aprAlDays;
    private Double mayAlDays;
    private Double junAlDays;
    private Double julAlDays;
    private Double augAlDays;
    private Double sepAlDays;
    private Double octAlDays;
    private Double novAlDays;
    private Double decAlDays;
}
