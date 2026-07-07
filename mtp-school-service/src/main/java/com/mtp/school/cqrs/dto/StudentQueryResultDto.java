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
    private Integer globalClientId;
    private LocalDate enrollmentDate;
    private Boolean isActive;
    
    private Boolean isIdPoor;
    private String idPoorNumber;
    private Boolean broughtByOutreachWorker;
    private String outreachWorkerName;
    private String outreachOrganization;

    private String middleName;
    private String gender;
    private String nationality;
    private String studentPhone;
    private AddressDto currentAddress;
    private AddressDto permanentAddress;
    private String studentCode;
    
    private String branchId;
    private String classroomId;
    private String dormitoryId;

    private List<StudentParentDto> parents;
    private List<ExtracurricularQueryResultDto> extracurriculars;
    private String imageUrl;
}
