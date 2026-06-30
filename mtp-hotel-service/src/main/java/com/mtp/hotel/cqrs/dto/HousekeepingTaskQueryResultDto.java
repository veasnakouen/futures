package com.mtp.hotel.cqrs.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class HousekeepingTaskQueryResultDto {
    private Integer id;
    private Integer roomId;
    private LocalDate taskDate;
    private String description;
    private String status;
}
