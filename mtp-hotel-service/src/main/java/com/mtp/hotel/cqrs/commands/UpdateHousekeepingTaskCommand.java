package com.mtp.hotel.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateHousekeepingTaskCommand {
    private Integer id;
    @NotNull(message = "Room ID is required") private Integer roomId;
    private LocalDate taskDate;
    @NotBlank(message = "Description is required") private String description;
    private String status;
}
