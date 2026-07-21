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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId")
    private Employee employee;

    private Integer scheduleYear;

    private String janShift;
    private String febShift;
    private String marShift;
    private String aprShift;
    private String mayShift;
    private String junShift;
    private String julShift;
    private String augShift;
    private String sepShift;
    private String octShift;
    private String novShift;
    private String decShift;
}
