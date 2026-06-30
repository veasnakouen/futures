package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student_parents")
@Data
@NoArgsConstructor
public class StudentParent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type")
    private RelationshipType relationshipType;
}
