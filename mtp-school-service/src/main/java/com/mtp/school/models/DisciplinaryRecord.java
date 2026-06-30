package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_disciplinary_records")
@Data
@NoArgsConstructor
public class DisciplinaryRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    private String description;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
