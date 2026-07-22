package com.mtp.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnualLeavePlanDto {
    private Integer id;
    private String employeeId; // Using employeeId (e.g., EMP-001)
    private String employeeName;
    private int planYear;
    private double janDays;
    private double febDays;
    private double marDays;
    private double aprDays;
    private double mayDays;
    private double junDays;
    private double julDays;
    private double augDays;
    private double sepDays;
    private double octDays;
    private double novDays;
    private double decDays;
    private LocalDateTime updatedAt;
    
    private java.util.List<LeaveDateRangeDto> dateRanges;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveDateRangeDto {
        private Integer id;
        private java.time.LocalDate startDate;
        private java.time.LocalDate endDate;
        private double calculatedDays;
    }
}
