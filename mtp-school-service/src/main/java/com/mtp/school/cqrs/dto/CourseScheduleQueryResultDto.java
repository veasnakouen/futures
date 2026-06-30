package com.mtp.school.cqrs.dto;

import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class CourseScheduleQueryResultDto {
    private String id;
    private String courseId;
    private String classroomId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isActive;
}
