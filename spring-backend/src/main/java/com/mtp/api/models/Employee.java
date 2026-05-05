package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "Employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 255)
    private String idNo;

    @NotNull
    @Size(max = 5)
    private String title;

    @NotNull
    @Size(max = 255)
    private String firstNameEnglish;

    @NotNull
    @Size(max = 255)
    private String lastNameEnglish;

    @Column(name = "FirstNameKhmer")
    private String firstNameKhmer;
    @Column(name = "LastNameKhmer")
    private String lastNameKhmer;

    @Size(max = 10)
    private String gender;

    private LocalDate dateOfBirth;

    @Column(name = "PlaceOfBirth")
    private String placeOfBirth;
    @Column(name = "Address")
    private String address;

    @Size(max = 255)
    private String country;

    @Size(max = 255)
    private String nationality;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PositionId")
    private Position position;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DepartmentId")
    private Department department;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String customFields;

    @Version
    private Integer version; // For CAP Consistency (Optimistic Locking)
}
