package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateStudentCommand {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;
    
    private LocalDate enrollmentDate = LocalDate.now();

    private List<StudentParentCommandDto> parentRelationships;
    private List<String> extracurricularIds;
    private String medicalConditions;
    private String customAttributes;
}
