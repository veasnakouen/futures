package com.mtp.clinic.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.mtp.clinic.enums.EncounterStatus;

@Entity
@Table(name = "clinic_encounters")
@Data
@NoArgsConstructor
@EntityListeners(org.springframework.data.jpa.domain.support.AuditingEntityListener.class)
public class Encounter {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "encounter_number")
    private String encounterNumber;
    
    @Column(name = "encounter_date_time")
    private LocalDateTime encounterDateTime;
    
    @Column(name = "encounter_type")
    private String encounterType;
    
    @Column(name = "reason_for_visit")
    private String reasonForVisit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id")
    private Provider provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    private String diagnosis;
    
    @Column(name = "treatment_notes")
    private String treatmentNotes;

    @Enumerated(EnumType.STRING)
    private EncounterStatus status;

    @org.springframework.data.annotation.CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @org.springframework.data.annotation.LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
