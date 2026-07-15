package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "Employees", indexes = {
        @Index(name = "idx_employee_idno", columnList = "idNo"),
        @Index(name = "idx_employee_fname", columnList = "firstNameEnglish"),
        @Index(name = "idx_employee_lname", columnList = "lastNameEnglish"),
        @Index(name = "idx_employee_status", columnList = "status"),
        @Index(name = "idx_employee_department", columnList = "DepartmentId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @jakarta.validation.constraints.NotBlank(message = "Employee ID is required")
    @Size(max = 255)
    private String idNo;

    @jakarta.validation.constraints.NotBlank(message = "Title is required")
    @Size(max = 10)
    private String title;

    @jakarta.validation.constraints.NotBlank(message = "First name is required")
    @Size(max = 255)
    private String firstNameEnglish;

    @jakarta.validation.constraints.NotBlank(message = "Last name is required")
    @Size(max = 255)
    private String lastNameEnglish;

    @Column(name = "FirstNameKhmer", columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String firstNameKhmer;
    @Column(name = "LastNameKhmer", columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String lastNameKhmer;

    @Size(max = 10)
    private String gender;
    // private Gener genders;

    private LocalDate dateOfBirth;

    @Column(name = "PlaceOfBirth")
    private String placeOfBirth;

    @Column(name = "Address")
    private String address;

    @Size(max = 255)
    private String country;

    @Size(max = 255)
    private String nationality;

    @jakarta.validation.constraints.Email(message = "Invalid email format")
    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String phoneNumber;

    @Size(max = 255)
    private String bloodGroup;

    @Size(max = 255)
    private String bankName;

    @Size(max = 255)
    private String bankAccountNumber;

    private LocalDate joinDate;

    @Size(max = 255)
    private String contractType;

    private LocalDate contractStartDate;

    private LocalDate contractEndDate;

    @Column(name = "ProbationEndDate")
    private LocalDate probationEndDate;

    @Size(max = 255)
    private String manager;

    @Size(max = 255)
    private String maritalStatus;

    @Size(max = 255)
    private String children;

    @Size(max = 255)
    private String emergencyContact;

    @Size(max = 255)
    private String emergencyContactName;

    @Size(max = 255)
    private String emergencyContactPhone;

    @Size(max = 255)
    @Column(name = "IdentityCardNumber")
    private String identityCardNumber;

    @Size(max = 255)
    private String identityCardType;

    @Size(max = 255)
    private String note;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String photo;

    @Size(max = 255)
    private String status;

    private Double basicSalary;

    private Double allowances = 0.0;
    
    private Double deductions = 0.0;
    
    private Double taxRate = 0.0; // percentage e.g. 0.10 for 10%

    private LocalDate resignationDate;
    private Double annualLeaveBalance = 0.0;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<LogBook> logBooks;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<EmergencyContact> emergencyContacts;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<EmployeeDocument> documents;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<EmployeeAsset> assets;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PositionId")
    private Position position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DepartmentId")
    private Department department;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String customFields;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String photoIdAttachment;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String contractAttachment;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String idPoorAttachment;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String cvAttachment;

    @Size(max = 255)
    private String biometricStatus;

    @Size(max = 255)
    private String biometricId;

    @Version
    private Integer version = 0; // For CAP Consistency (Optimistic Locking)
}
