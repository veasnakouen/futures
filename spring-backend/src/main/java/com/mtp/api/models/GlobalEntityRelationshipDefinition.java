package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "global_entity_relationship_definitions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalEntityRelationshipDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "source_entity_key", nullable = false)
    private String sourceEntityKey; // e.g., "EQUIPMENT_TRACKER"

    @Column(name = "relationship_name", nullable = false)
    private String relationshipName; // e.g., "Assigned Patient", "Responsible Doctor", "Linked Invoice"

    @Column(name = "target_entity_key", nullable = false)
    private String targetEntityKey; // e.g., "PATIENTS", "USERS", "STUDENTS", "CASES", "INVOICES", "POS_PRODUCTS"

    @Column(name = "relationship_type", nullable = false)
    private String relationshipType; // e.g., "MANY_TO_ONE", "ONE_TO_MANY", "MANY_TO_MANY"

    @Builder.Default
    @Column(name = "is_required")
    private Boolean isRequired = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
