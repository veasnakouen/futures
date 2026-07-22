package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "LeaveDateRanges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveDateRange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AnnualLeavePlanId")
    private AnnualLeavePlan annualLeavePlan;

    private LocalDate startDate;
    private LocalDate endDate;
    private double calculatedDays;
}
