package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import com.mtp.school.cqrs.dto.AddressDto;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateTeacherCommand {
    @NotBlank(message = "First name is required")
    private String firstName;
    @NotBlank(message = "Last name is required")
    private String lastName;
    private String email;
    private String subject;
    private List<String> courseIds;
    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;
    
    private java.math.BigDecimal baseSalary;
    private com.mtp.school.cqrs.dto.AddressDto address;
    private String branchId;
    private String imageUrl;
    
    private String facebookLink;
    private String instagramLink;
    private String twitterLink;
    private String linkedinLink;
}
