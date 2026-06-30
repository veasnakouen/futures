package com.mtp.school.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class StudentQueryResultDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private String clinicPatientId;
    private LocalDate enrollmentDate;
    private Boolean isActive;

    private List<StudentParentDto> parents;
    private List<ExtracurricularQueryResultDto> extracurriculars;
}
