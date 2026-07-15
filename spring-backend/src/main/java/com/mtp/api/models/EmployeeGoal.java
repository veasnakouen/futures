package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Entity
@Table(name = "EmployeeGoals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appraisal_cycle_id")
    @JsonBackReference
    private AppraisalCycle appraisalCycle;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer targetCompletionPercentage;
    private Integer currentCompletionPercentage = 0;

    private LocalDate targetDate;
    
    private String status; // ON_TRACK, AT_RISK, DELAYED, COMPLETED
}
