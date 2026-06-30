package com.mtp.clinic.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinic_diagnoses")
@Data
@NoArgsConstructor
@EntityListeners(org.springframework.data.jpa.domain.support.AuditingEntityListener.class)
public class Diagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @ManyToOne
    @JoinColumn(name = "encounter_id")
    private Encounter encounter;

    private String icd10Code;
    private String diagnosisDescription;

    @org.springframework.data.annotation.CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
