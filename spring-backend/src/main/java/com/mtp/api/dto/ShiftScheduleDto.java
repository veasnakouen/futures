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
    private LocalDate weekStartDate;
    private String mondayShift;
    private String tuesdayShift;
    private String wednesdayShift;
    private String thursdayShift;
    private String fridayShift;
    private String saturdayShift;
    private String sundayShift;
}
