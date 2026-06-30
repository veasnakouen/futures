package com.mtp.clinic.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import org.springframework.data.annotation.CreatedDate;

@Entity
@Table(name = "clinic_medical_records")
@Data
@NoArgsConstructor
@EntityListeners(org.springframework.data.jpa.domain.support.AuditingEntityListener.class)
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Provider doctor;

    @CreatedDate
    private LocalDate recordDate;

    @Column(length = 1000)
    private String diagnosis;

    @Column(length = 1000)
    private String treatment;

    @Column(length = 1000)
    private String prescription;
}
