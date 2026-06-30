package com.mtp.api.controllers;

import com.mtp.api.dto.BiometricRequest;
import com.mtp.api.dto.ManualAttendanceRequest;
import com.mtp.api.models.Attendance;
import com.mtp.api.models.BiometricDevice;
import com.mtp.api.services.AttendanceService;
import com.mtp.api.repositories.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/hr/attendance")
public class AttendanceController {

    private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping
    public List<Attendance> getAll(
            @RequestParam(required = false) String startdate,
            @RequestParam(required = false) String enddate) {
        if (startdate != null && enddate != null && !startdate.isEmpty() && !enddate.isEmpty()) {
            java.time.LocalDateTime start = java.time.LocalDate.parse(startdate).atStartOfDay();
            java.time.LocalDateTime end = java.time.LocalDate.parse(enddate).atTime(23, 59, 59);
            return attendanceRepository.findByClockInBetween(start, end);
        }
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
    public ResponseEntity<?> biometricCheck(@Valid @RequestBody BiometricRequest request) {
        return attendanceService.processBiometricCheck(request);
    }

    @PostMapping("/manual")
    public ResponseEntity<Attendance> submitManualLog(@Valid @RequestBody ManualAttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.submitManualLog(request));
    }
    @GetMapping("/test-connection")
    public ResponseEntity<Boolean> testConnection(@RequestParam String ipAddress, @RequestParam int port) {
        System.out.println(">>> INCOMING TEST REQUEST: " + ipAddress + ":" + port);
        return ResponseEntity.ok(attendanceService.testConnection(ipAddress, port));
    }

    @PostMapping("/sync-device")
    public ResponseEntity<?> syncDevice(@RequestParam String ipAddress) {
        try {
            attendanceService.syncDeviceData(ipAddress);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            log.error("Sync failed for {}: {}", ipAddress, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Hardware Sync Error: " + e.getMessage());
        }
    }

    @GetMapping("/device-users")
    public ResponseEntity<?> getDeviceUsers(@RequestParam String ipAddress) {
        return ResponseEntity.ok(attendanceService.getDeviceUsers(ipAddress));
    }

    // Device Management Endpoints
    @GetMapping("/devices")
    public ResponseEntity<?> getDevices() {
        return ResponseEntity.ok(attendanceService.getAllDevices());
    }

    @PostMapping("/devices")
    public ResponseEntity<?> createDevice(@RequestBody BiometricDevice device) {
        return ResponseEntity.ok(attendanceService.saveDevice(device));
    }

    @PutMapping("/devices/{id}")
    public ResponseEntity<?> updateDevice(@PathVariable Integer id, @RequestBody BiometricDevice device) {
        device.setId(id);
        return ResponseEntity.ok(attendanceService.saveDevice(device));
    }

    @DeleteMapping("/devices/{id}")
    public ResponseEntity<?> deleteDevice(@PathVariable Integer id) {
        attendanceService.deleteDevice(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/probe-device")
    public ResponseEntity<String> probeDevice(@RequestParam String ipAddress, @RequestParam int port) {
        return ResponseEntity.ok(attendanceService.probeDevice(ipAddress, port));
    }
}
