package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateExtracurricularCommand {
    private String id;
    @NotBlank(message = "Name is required") 
    private String name;

    private String description;
    private String schedule;
    private String location;
    private Integer capacity;
    private Double cost;
    private String leadTeacherId;
}
