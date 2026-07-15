package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "AppraisalCycles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppraisalCycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    private String name; // e.g., 2026 Q1 Review

    private LocalDate startDate;
    private LocalDate endDate;

    private String status; // UPCOMING, ACTIVE, COMPLETED, CLOSED
}
