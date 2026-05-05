package com.mtp.api.controllers;

import com.mtp.api.dto.BiometricRequest;
import com.mtp.api.models.Attendance;
import com.mtp.api.services.AttendanceService;
import com.mtp.api.repositories.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping
    public List<Attendance> getAll() {
        return attendanceRepository.findAll();
    }

    @GetMapping("/employee/{id}")
    public List<Attendance> getByEmployee(@PathVariable Integer id) {
        return attendanceRepository.findByEmployeeId(id);
    }

    @PostMapping("/clock-in")
    public ResponseEntity<?> clockIn(@RequestParam Integer employeeId,
            @RequestParam(required = false) String location) {
        try {
            return ResponseEntity.ok(attendanceService.clockIn(employeeId, location, "Manual Clock-In"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/clock-out")
    public ResponseEntity<?> clockOut(@RequestParam Integer employeeId) {
        try {
            return ResponseEntity.ok(attendanceService.clockOut(employeeId, "Manual Clock-Out"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Generic Biometric Gateway.
     * Supports Fingerprint, FaceID, RFID, etc.
     */
    @PostMapping("/biometric")
    public ResponseEntity<?> biometricCheck(@RequestBody BiometricRequest request) {
        return attendanceService.processBiometricCheck(request);
    }
}
