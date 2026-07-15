package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "EmployeeEnrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId", nullable = false)
    private EmployeeCourse course;

    @NotNull
    private Integer progress; // 0 to 100

    @NotNull
    @Size(max = 50)
    private String status; // Completed, In Progress, Not Started

    @NotNull
    private LocalDate enrolledAt;

    private LocalDate completedAt;

    @NotNull
    private LocalDate deadline;
}
