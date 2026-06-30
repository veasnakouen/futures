package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateExtracurricularCommand {
    @NotBlank(message = "Name is required") private String name;
}
