package com.mtp.clinic.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "custom_field_definitions")
@Data
@NoArgsConstructor
public class CustomFieldDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(nullable = false)
    private String entityType; // e.g., "PATIENT"

    @Column(nullable = false)
    private String fieldName; // e.g., "sponsorId"

    @Column(nullable = false)
    private String fieldLabel; // e.g., "Sponsor ID"

    @Column(nullable = false)
    private String fieldType; // e.g., "TEXT", "NUMBER", "DATE", "SELECT"

    private Boolean isRequired = false;

    // Optional: for SELECT types, comma separated values
    private String options;
}
