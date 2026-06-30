package com.mtp.clinic.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;

@Entity
@Data
@NoArgsConstructor
@Table(name = "clinic_staff")
@Inheritance(strategy = InheritanceType.JOINED)
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    private String specialization;
    @Column(nullable = false)
    private String contactNumber;
    @Column(nullable = false)
    private String email;
    private Boolean isActive;
    private String employeeId;
    @Column(nullable = false)
    private String role;
    private LocalDate hiredDate;
    private LocalDate terminationDate;
    @Column(nullable = true)
    private String shift;

}
