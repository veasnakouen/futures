package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_extracurriculars")
@Data
@NoArgsConstructor
public class Extracurricular {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    private String name;
    private String description;
    private String schedule;
    private String location;
    private Integer capacity;
    private Double cost;

    // The main teacher leading the activity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_teacher_id")
    private Teacher leadTeacher;

    // Additional teachers assisting the activity
    @ManyToMany
    @JoinTable(name = "extracurricular_assistants", joinColumns = @JoinColumn(name = "extracurricular_id"), inverseJoinColumns = @JoinColumn(name = "teacher_id"))
    private java.util.List<Teacher> assistantTeachers = new java.util.ArrayList<>();

    // The students participating in this extracurricular activity
    @ManyToMany(mappedBy = "extracurriculars")
    private java.util.List<Student> participatingStudents = new java.util.ArrayList<>();
}
