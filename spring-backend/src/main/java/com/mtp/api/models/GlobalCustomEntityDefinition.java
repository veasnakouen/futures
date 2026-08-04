package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "global_custom_entity_definitions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalCustomEntityDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "entity_key", nullable = false, unique = true)
    private String entityKey; // e.g., "EQUIPMENT_TRACKER", "VEHICLE_LOG", "INSURANCE_CLAIM"

    @Column(name = "entity_label", nullable = false)
    private String entityLabel; // e.g., "Medical Equipment Tracker"

    @Column(name = "category")
    private String category; // e.g., "CLINIC", "SCHOOL", "HR", "FINANCE", "GENERAL"

    @Column(name = "icon_name")
    private String iconName; // e.g., "Stethoscope", "Car", "Briefcase", "Boxes"

    @Column(name = "description", length = 1000)
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
