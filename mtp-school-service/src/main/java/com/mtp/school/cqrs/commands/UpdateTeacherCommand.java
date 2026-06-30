package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateTeacherCommand {
    private String id;
    @NotBlank(message = "First name is required") private String firstName;
    @NotBlank(message = "Last name is required") private String lastName;
    @Email(message = "Invalid email format") @NotBlank(message = "Email is required") private String email;
    @NotBlank(message = "Subject is required") private String subject;
    @NotNull(message = "Hire date is required") private LocalDate hireDate;
    private Boolean isActive;
    private java.math.BigDecimal baseSalary;
    private com.mtp.school.cqrs.dto.AddressDto address;
    private String branchId;
}
