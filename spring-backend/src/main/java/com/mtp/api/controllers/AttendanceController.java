package com.mtp.api.controllers;

import com.mtp.api.dto.ApiResponse;
import com.mtp.api.dto.BiometricRequest;
import com.mtp.api.dto.ManualAttendanceRequest;
import com.mtp.api.models.Attendance;
import com.mtp.api.models.BiometricDevice;
import com.mtp.api.services.AttendanceService;
import com.mtp.api.services.QRCodeService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);

    private final AttendanceService attendanceService;
    private final QRCodeService qrCodeService;

    public AttendanceController(AttendanceService attendanceService, QRCodeService qrCodeService) {
        this.attendanceService = attendanceService;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Attendance>>> getAll(
            @RequestParam(required = false) String startdate,
            @RequestParam(required = false) String enddate) {
        List<Attendance> result = attendanceService.findAll(startdate, enddate);
        return ResponseEntity.ok(ApiResponse.success("Attendance logs fetched successfully", result));
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getByEmployee(@PathVariable Integer id) {
        List<Attendance> result = attendanceService.findByEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee attendance logs fetched successfully", result));
    }

    @PostMapping("/clock-in")
    public ResponseEntity<ApiResponse<Attendance>> clockIn(
            @RequestParam Integer employeeId,
            @RequestParam(required = false) String location) {
        try {
            Attendance attendance = attendanceService.clockIn(employeeId, location, "Manual Clock-In");
            return ResponseEntity.ok(ApiResponse.success("Clock-in recorded successfully", attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/clock-out")
    public ResponseEntity<ApiResponse<Attendance>> clockOut(@RequestParam Integer employeeId) {
        try {
            Attendance attendance = attendanceService.clockOut(employeeId, "Manual Clock-Out");
            return ResponseEntity.ok(ApiResponse.success("Clock-out recorded successfully", attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/biometric")
    public ResponseEntity<?> biometricCheck(@Valid @RequestBody BiometricRequest request) {
        return attendanceService.processBiometricCheck(request);
    }

    @PostMapping("/manual")
    public ResponseEntity<ApiResponse<Attendance>> submitManualLog(
            @Valid @RequestBody ManualAttendanceRequest request) {
        Attendance attendance = attendanceService.submitManualLog(request);
        return ResponseEntity.ok(ApiResponse.success("Manual attendance logged successfully", attendance));
    }

    @GetMapping("/test-connection")
    public ResponseEntity<ApiResponse<Boolean>> testConnection(@RequestParam String ipAddress, @RequestParam int port) {
        boolean connected = attendanceService.testConnection(ipAddress, port);
        return ResponseEntity.ok(ApiResponse.success("Connection test completed", connected));
    }

    @PostMapping("/sync-device")
    public ResponseEntity<ApiResponse<Boolean>> syncDevice(@RequestParam String ipAddress) {
        try {
            attendanceService.syncDeviceData(ipAddress);
            return ResponseEntity.ok(ApiResponse.success("Hardware sync completed successfully", true));
        } catch (Exception e) {
            log.error("Sync failed for {}: {}", ipAddress, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Hardware Sync Error: " + e.getMessage()));
        }
    }

    @GetMapping("/device-users")
    public ResponseEntity<ApiResponse<?>> getDeviceUsers(@RequestParam String ipAddress) {
        var users = attendanceService.getDeviceUsers(ipAddress);
        return ResponseEntity.ok(ApiResponse.success("Device users fetched successfully", users));
    }

    @GetMapping("/devices")
    public ResponseEntity<ApiResponse<List<BiometricDevice>>> getDevices() {
        List<BiometricDevice> devices = attendanceService.getAllDevices();
        return ResponseEntity.ok(ApiResponse.success("Biometric devices fetched successfully", devices));
    }

    @PostMapping("/devices")
    public ResponseEntity<ApiResponse<BiometricDevice>> createDevice(@RequestBody BiometricDevice device) {
        BiometricDevice saved = attendanceService.saveDevice(device);
        return ResponseEntity.ok(ApiResponse.success("Biometric device created successfully", saved));
    }

    @PutMapping("/devices/{id}")
    public ResponseEntity<ApiResponse<BiometricDevice>> updateDevice(@PathVariable Integer id,
            @RequestBody BiometricDevice device) {
        device.setId(id);
        BiometricDevice updated = attendanceService.saveDevice(device);
        return ResponseEntity.ok(ApiResponse.success("Biometric device updated successfully", updated));
    }

    @DeleteMapping("/devices/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDevice(@PathVariable Integer id) {
        attendanceService.deleteDevice(id);
        return ResponseEntity.ok(ApiResponse.success("Biometric device deleted successfully", null));
    }

    @GetMapping("/probe-device")
    public ResponseEntity<ApiResponse<String>> probeDevice(@RequestParam String ipAddress, @RequestParam int port) {
        String info = attendanceService.probeDevice(ipAddress, port);
        return ResponseEntity.ok(ApiResponse.success("Device probe info fetched", info));
    }

    @GetMapping("/department/{id}/qr")
    public ResponseEntity<ApiResponse<String>> getDepartmentQrToken(@PathVariable Integer id) {
        String token = qrCodeService.generateDepartmentQrToken(id, false);
        return ResponseEntity.ok(ApiResponse.success("QR token generated successfully", token));
    }

    @PostMapping("/scan-qr")
    public ResponseEntity<?> scanQrCode(
            @RequestParam String token,
            @RequestParam Integer employeeId,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng) {
        try {
            Integer departmentId = qrCodeService.validateAndGetDepartmentId(token);
            if (departmentId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid or expired QR code"));
            }
            return attendanceService.processQrScan(employeeId, departmentId, lat, lng);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}