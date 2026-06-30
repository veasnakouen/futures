package com.mtp.api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
public class ManualAttendanceRequest {
    @NotNull(message = "Employee ID is required")
    private Integer employeeId;

    @NotNull(message = "Clock-in time is required")
    private LocalDateTime clockIn;

    private LocalDateTime clockOut;

    @Size(max = 255)
    private String location;

    @Size(max = 500)
    private String note;

    @NotBlank(message = "Status is required")
    private String status;
}
