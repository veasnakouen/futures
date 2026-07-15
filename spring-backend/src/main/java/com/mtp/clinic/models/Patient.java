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

    @Column(name = "medical_record_number")
    private String medicalRecordNumber;

    @Column(name = "poor_id")
    private String poorId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "contact_number")
    private String contactNumber;

    private String email;

    @Column(name = "blood_type")
    private String bloodType;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Embedded
    private Address address;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "custom_attributes", columnDefinition = "NVARCHAR(MAX)")
    private String customAttributes;
}
