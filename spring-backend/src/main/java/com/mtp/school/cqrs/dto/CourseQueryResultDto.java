package com.mtp.school.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CourseQueryResultDto {
    private String id;
    private String name;
    private String description;
    private String subject;
    private Integer credits;
    private String teacherId;
    private String teacherFirstName;
    private String teacherLastName;
    private String imageUrl;
}
