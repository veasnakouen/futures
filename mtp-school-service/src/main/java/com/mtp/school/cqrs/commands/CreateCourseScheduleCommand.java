package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class CreateCourseScheduleCommand {
    @NotNull(message = "Course ID is required")
    private String courseId;

    @NotNull(message = "Classroom ID is required")
    private String classroomId;

    @NotNull(message = "Day of week is required")
    private DayOfWeek dayOfWeek;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;
}
