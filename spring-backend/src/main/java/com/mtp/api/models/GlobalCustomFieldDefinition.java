package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "global_custom_field_definitions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalCustomFieldDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "entity_type", nullable = false)
    private String entityType; // e.g., "USERS", "CASES", "INVENTORY", "STUDENTS", "PATIENTS", "INVOICES"

    @Column(name = "field_key", nullable = false)
    private String fieldKey; // e.g., "emergencyContactPhone"

    @Column(name = "field_label", nullable = false)
    private String fieldLabel; // e.g., "Emergency Contact Phone"

    @Column(name = "field_type", nullable = false)
    private String fieldType; // e.g., "TEXT", "NUMBER", "DATE", "BOOLEAN", "SELECT", "TEXTAREA", "EMAIL", "URL"

    @Builder.Default
    @Column(name = "is_required")
    private Boolean isRequired = false;

    @Column(name = "options", length = 1000)
    private String options; // Comma separated for SELECT type

    @Column(name = "description")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
