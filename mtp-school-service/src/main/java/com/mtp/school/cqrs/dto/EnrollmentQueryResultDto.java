package com.mtp.school.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EnrollmentQueryResultDto {
    private String id;
    private String studentId;
    private String courseId;
    private LocalDate enrollmentDate;
    private String grade;
}
