package com.mtp.api.services.impl;

import com.mtp.api.dto.BiometricRequest;
import com.mtp.api.models.Attendance;
import com.mtp.api.models.Employee;
import com.mtp.api.repositories.AttendanceRepository;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.services.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public ResponseEntity<?> processBiometricCheck(BiometricRequest request) {
        // 1. Identify Employee (Generic: currently by idNo, could be expanded to other fields)
        Optional<Employee> employeeOpt = employeeRepository.findByIdNo(request.getIdentifier());
        
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee emp = employeeOpt.get();

        // 2. Determine Action (Toggle Clock-In/Out)
        Optional<Attendance> activeAttendance = attendanceRepository
                .findTopByEmployeeIdAndClockOutIsNullOrderByClockInDesc(emp.getId());

        if (activeAttendance.isPresent()) {
            // Already in -> Clock Out
            Attendance a = activeAttendance.get();
            a.setClockOut(LocalDateTime.now());
            String sourceInfo = String.format("Source: %s (%s)", request.getType(), request.getDeviceName());
            a.setNote(a.getNote() == null ? "Biometric Out | " + sourceInfo : a.getNote() + " | " + sourceInfo);
            return ResponseEntity.ok(attendanceRepository.save(a));
        } else {
            // Not in -> Clock In
            Attendance a = new Attendance();
            a.setEmployee(emp);
            a.setClockIn(LocalDateTime.now());
            a.setLocation(request.getLocation() != null ? request.getLocation() : request.getDeviceName());
            a.setStatus("Present");
            a.setNote("Biometric In | Source: " + request.getType());
            return ResponseEntity.ok(attendanceRepository.save(a));
        }
    }

    @Override
    public Attendance clockIn(Integer employeeId, String location, String note) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        Attendance a = new Attendance();
        a.setEmployee(emp);
        a.setClockIn(LocalDateTime.now());
        a.setLocation(location);
        a.setNote(note);
        a.setStatus("Present");
        return attendanceRepository.save(a);
    }

    @Override
    public Attendance clockOut(Integer employeeId, String note) {
        Attendance a = attendanceRepository.findTopByEmployeeIdAndClockOutIsNullOrderByClockInDesc(employeeId)
                .orElseThrow(() -> new RuntimeException("No active clock-in found"));
        
        a.setClockOut(LocalDateTime.now());
        if (note != null) a.setNote(a.getNote() == null ? note : a.getNote() + " | " + note);
        return attendanceRepository.save(a);
    }
}
