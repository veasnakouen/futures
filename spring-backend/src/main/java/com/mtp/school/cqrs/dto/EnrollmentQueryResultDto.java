package com.mtp.school.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EnrollmentQueryResultDto {
    private String id;
    private String studentId;
    private String studentName;
    private String courseId;
    private String courseName;
    private LocalDate enrollmentDate;
    private String grade;
}
