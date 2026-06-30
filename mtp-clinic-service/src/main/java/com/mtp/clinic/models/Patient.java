package com.mtp.clinic.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import com.mtp.clinic.enums.Gender;

@Entity
@Table(name = "clinic_patients")
@Data
@NoArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    private String medicalRecordNumber;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;

    private String contactNumber;
    private String email;
    private String bloodType;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Embedded
    private Address address;
    private Boolean isActive = true;

    @Column(name = "custom_attributes", columnDefinition = "NVARCHAR(MAX)")
    private String customAttributes;
}
