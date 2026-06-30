package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "ShiftSchedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "EmployeeId")
    private Employee employee;

    private LocalDate weekStartDate;

    private String mondayShift;
    private String tuesdayShift;
    private String wednesdayShift;
    private String thursdayShift;
    private String fridayShift;
}
