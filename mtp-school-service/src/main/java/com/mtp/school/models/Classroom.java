package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_classrooms")
@Data
@NoArgsConstructor
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    @Column(nullable = false)
    private Integer capacity;

    private String building;
    private Integer floor;

    @Column(name = "room_type")
    private String roomType; // e.g., "Laboratory", "Lecture Hall", "Standard"

    private Boolean hasProjector;

    private Boolean isActive = true;

    // The schedules mapped to this classroom
    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<CourseSchedule> schedules = new java.util.ArrayList<>();
}
