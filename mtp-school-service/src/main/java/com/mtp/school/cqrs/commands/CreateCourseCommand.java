package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateCourseCommand {
    @NotBlank(message = "Name is required") private String name;
    private String description;
    @NotNull(message = "Credits is required") @Min(value=1, message="Must have at least 1 credit") private Integer credits;
    private String teacherId;
}
