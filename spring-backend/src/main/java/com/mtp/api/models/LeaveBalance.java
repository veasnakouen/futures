package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "LeaveBalances")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId")
    private Employee employee;

    private int year; // The year this balance applies to, e.g., 2026

    private double totalAnnualLeave; // e.g. 18 (base) + 1 per 3 years
    private double carriedOverAnnualLeave; // Carried over from previous year
    private double usedAnnualLeave;

    private double totalSickLeave; // e.g. 14
    private double usedSickLeave;

    private double totalSpecialLeave; // e.g. 7
    private double usedSpecialLeave;

    private LocalDateTime updatedAt = LocalDateTime.now();
}
