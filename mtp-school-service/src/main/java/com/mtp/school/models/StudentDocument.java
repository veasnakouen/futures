package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_student_documents")
@Data
@NoArgsConstructor
public class StudentDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    private String documentType;
    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
