package com.mtp.school.cqrs.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TeacherQueryResultDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String subject;
    private LocalDate hireDate;
    private Boolean isActive;
    private java.math.BigDecimal baseSalary;
    private com.mtp.school.cqrs.dto.AddressDto address;
    private String branchId;
    private String imageUrl;
    
    private String facebookLink;
    private String instagramLink;
    private String twitterLink;
    private String linkedinLink;
}
