package com.mtp.attendance.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_attendance_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeAttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private Long departmentId;

    @Column(nullable = false)
    private LocalDateTime scanTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScanType scanType; // CHECK_IN, CHECK_OUT

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScanStatus status; // VALID, FLAGGED, PENDING

    @Enumerated(EnumType.STRING)
    private AttendanceMode scanMode;

    private Double scanLatitude;
    private Double scanLongitude;
    private Double accuracyMeters;
    
    private String scanIpAddress;
    private String deviceFingerprint;
    
    @Column(length = 500)
    private String flagReason;
}
