package com.mtp.school.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExtracurricularQueryResultDto {
    private String id;
    private String name;
    private String description;
    private String schedule;
    private String location;
    private Integer capacity;
    private Double cost;
    private String leadTeacherId;
}
