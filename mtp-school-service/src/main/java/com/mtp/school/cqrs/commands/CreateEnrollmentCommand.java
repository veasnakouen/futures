package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateEnrollmentCommand {
    @NotNull(message = "Student ID is required") private String studentId;
    @NotNull(message = "Course ID is required") private String courseId;
    private LocalDate enrollmentDate = LocalDate.now();
}
