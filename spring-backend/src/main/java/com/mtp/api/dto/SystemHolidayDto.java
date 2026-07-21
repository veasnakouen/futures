package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SystemHolidayDto {
    private Integer id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String category;
    private String description;
}
