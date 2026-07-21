package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "AnnualLeavePlans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnualLeavePlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId")
    private Employee employee;

    private int planYear;

    private double janDays;
    private double febDays;
    private double marDays;
    private double aprDays;
    private double mayDays;
    private double junDays;
    private double julDays;
    private double augDays;
    private double sepDays;
    private double octDays;
    private double novDays;
    private double decDays;

    private LocalDateTime updatedAt = LocalDateTime.now();
}
