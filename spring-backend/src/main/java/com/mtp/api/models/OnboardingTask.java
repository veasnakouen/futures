package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "OnboardingTasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checklist_id")
    @JsonBackReference
    private OnboardingChecklist checklist;

    @NotBlank
    private String taskName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String requiredDocument; // null if no upload required

    private Boolean isCompleted = false;

    private LocalDateTime completedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_role_id")
    private Role assignedToRole; // Who performs this (HR, IT, Manager, or the new Employee themselves)
}
