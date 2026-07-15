package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity(name = "SchoolDepartment")
@Table(name = "school_departments")
@Data
@NoArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "required_role")
    private String requiredRole;

    @Column(name = "head_of_department")
    private String headOfDepartment;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "location")
    private String location;

    private boolean isActive = true;

    private LocalDateTime createdAt = LocalDateTime.now();
}
