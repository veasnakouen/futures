package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "WeeklySchedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklySchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId", nullable = false)
    private Employee employee;

    private LocalDate weekStartDate;

    @Column(name = "monday_shift", length = 255)
    private String mondayShift;

    @Column(name = "tuesday_shift", length = 255)
    private String tuesdayShift;

    @Column(name = "wednesday_shift", length = 255)
    private String wednesdayShift;

    @Column(name = "thursday_shift", length = 255)
    private String thursdayShift;

    @Column(name = "friday_shift", length = 255)
    private String fridayShift;

    @Column(name = "saturday_shift", length = 255)
    private String saturdayShift;

    @Column(name = "sunday_shift", length = 255)
    private String sundayShift;
}
