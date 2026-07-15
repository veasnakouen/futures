package com.mtp.clinic.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "ClinicDepartment")
@Data
@NoArgsConstructor
@Table(name = "clinic_departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "department_name")
    private String departmentName;
    private String description;
    @Column(nullable = true)
    private String code;
    @Column(name = "is_active")
    private Boolean isActive;

}
