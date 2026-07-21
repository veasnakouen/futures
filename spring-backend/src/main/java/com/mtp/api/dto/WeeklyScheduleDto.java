package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class WeeklyScheduleDto {
    private Integer id;
    private String employeeId; // employee idNo
    private String employeeName;
    private Integer departmentId;
    private LocalDate weekStartDate;
    private String mondayShift;
    private String tuesdayShift;
    private String wednesdayShift;
    private String thursdayShift;
    private String fridayShift;
    private String saturdayShift;
    private String sundayShift;
}
