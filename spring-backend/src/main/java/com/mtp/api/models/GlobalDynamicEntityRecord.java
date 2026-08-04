package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "global_dynamic_entity_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalDynamicEntityRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "entity_key", nullable = false)
    private String entityKey; // e.g., "EQUIPMENT_TRACKER"

    @Column(name = "record_code", nullable = false)
    private String recordCode; // e.g., "REC-2026-001"

    @Column(name = "data_json", length = 10000)
    private String dataJson; // JSON string of dynamic field key-value pairs

    @Column(name = "relations_json", length = 10000)
    private String relationsJson; // JSON string of foreign key mappings e.g. {"patientId": "102", "doctorId": "5"}

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
