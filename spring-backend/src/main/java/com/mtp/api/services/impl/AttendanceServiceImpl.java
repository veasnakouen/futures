package com.mtp.api.services.impl;

import com.mtp.api.dto.BiometricRequest;
import com.mtp.api.dto.ManualAttendanceRequest;
import com.mtp.api.models.Attendance;
import com.mtp.api.models.BiometricDevice;
import com.mtp.api.models.Employee;
import com.mtp.api.repositories.AttendanceRepository;
import com.mtp.api.repositories.BiometricDeviceRepository;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.services.AttendanceService;
import com.mtp.api.services.attendance.AttendanceScheduleEvaluator;
import com.mtp.api.services.attendance.BiometricDeviceSyncService;
import com.mtp.api.services.attendance.GeoLocationValidator;
import com.mtp.api.utils.ZkDeviceClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.InetSocketAddress;
import java.net.Socket;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BiometricDeviceRepository deviceRepository;

    @Autowired
    private GeoLocationValidator geoLocationValidator;

    @Autowired
    private AttendanceScheduleEvaluator scheduleEvaluator;

    @Autowired
    private BiometricDeviceSyncService biometricDeviceSyncService;

    @Override
    @Transactional
    public ResponseEntity<?> processBiometricCheck(BiometricRequest request) {
        Optional<Employee> employeeOpt = employeeRepository.findByIdNo(request.getIdentifier());
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee emp = employeeOpt.get();
        Optional<Attendance> activeAttendance = attendanceRepository
                .findTopByEmployeeIdAndClockOutIsNullOrderByClockInDesc(emp.getId());

        if (activeAttendance.isPresent()) {
            Attendance a = activeAttendance.get();
            a.setClockOut(LocalDateTime.now());
            String sourceInfo = String.format("Source: %s (%s)", request.getType(), request.getDeviceName());
            a.setNote(a.getNote() == null ? "Biometric Out | " + sourceInfo : a.getNote() + " | " + sourceInfo);
            return ResponseEntity.ok(attendanceRepository.save(a));
        } else {
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
    @Transactional
    public ResponseEntity<?> processQrScan(Integer employeeId, Integer departmentId, Double lat, Double lng) {
        Employee emp = employeeRepository.findById(employeeId).orElse(null);
        if (emp == null)
            return ResponseEntity.badRequest().body("Employee not found");

        ResponseEntity<String> geoErr = geoLocationValidator.validateLocation(departmentId, lat, lng);
        if (geoErr != null)
            return geoErr;

        LocalDateTime now = LocalDateTime.now();
        AttendanceScheduleEvaluator.ScheduleEvalResult scheduleResult = scheduleEvaluator.evaluateSchedule(emp.getId(),
                now);

        Optional<Attendance> activeAttendance = attendanceRepository
                .findTopByEmployeeIdAndClockOutIsNullOrderByClockInDesc(emp.getId());

        if (activeAttendance.isPresent()) {
            Attendance a = activeAttendance.get();
            a.setClockOut(now);
            a.setNote("QR Out (Schedule: " + scheduleResult.targetTimetableName + ")");
            return ResponseEntity.ok(attendanceRepository.save(a));
        } else {
            Attendance a = new Attendance();
            a.setEmployee(emp);
            a.setClockIn(now);
            a.setLocation("Department " + departmentId + " QR Scan");

            String lateStatus = scheduleEvaluator.computeLateStatus(scheduleResult.timetable, now,
                    scheduleResult.targetTimetableName);
            if ("LATE".equals(lateStatus)) {
                a.setStatus("Late");
                a.setNote("QR In | LATE (Schedule: " + scheduleResult.targetTimetableName + ")");
            } else {
                a.setStatus("Present");
                a.setNote("QR In | On Time (Schedule: " + scheduleResult.targetTimetableName + ")");
            }
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
        if (note != null)
            a.setNote(a.getNote() == null ? note : a.getNote() + " | " + note);
        return attendanceRepository.save(a);
    }

    @Override
    public Attendance submitManualLog(ManualAttendanceRequest request) {
        Employee emp = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (request.getClockOut() != null && request.getClockOut().isBefore(request.getClockIn())) {
            throw new IllegalArgumentException("Clock-out time cannot be before clock-in time");
        }

        Attendance a = new Attendance();
        a.setEmployee(emp);
        a.setClockIn(request.getClockIn());
        a.setClockOut(request.getClockOut());
        a.setLocation(request.getLocation());
        a.setNote(request.getNote());
        a.setStatus(request.getStatus() != null ? request.getStatus() : "Present");

        return attendanceRepository.save(a);
    }

    @Override
    @Transactional
    public void syncDeviceData(String deviceIp) {
        biometricDeviceSyncService.syncDeviceData(deviceIp);
    }

    @Override
    public List<com.mtp.api.utils.zk.ZkUser> getDeviceUsers(String deviceIp) {
        BiometricDevice device = deviceRepository.findFirstByIpAddress(deviceIp);
        if (device == null)
            return new ArrayList<>();
        ZkDeviceClient client = new ZkDeviceClient(device.getIpAddress(), device.getPort());
        try {
            return client.fetchUserList();
        } catch (Exception e) {
            log.error("Failed to fetch user list from {}: {}", deviceIp, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public boolean testConnection(String ipAddress, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(ipAddress, port), 2000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<BiometricDevice> getAllDevices() {
        return deviceRepository.findAll();
    }

    @Override
    @Transactional
    public BiometricDevice saveDevice(BiometricDevice device) {
        return deviceRepository.save(device);
    }

    @Override
    @Transactional
    public void deleteDevice(Integer id) {
        deviceRepository.deleteById(id);
    }

    @Override
    public String probeDevice(String ipAddress, int port) {
        try {
            ZkDeviceClient client = new ZkDeviceClient(ipAddress, port);
            return client.getDeviceInfo();
        } catch (Exception e) {
            return "Probe Error: " + e.getMessage();
        }
    }

    @Override
    public List<Attendance> findAll(String startdate, String enddate) {
        if (startdate != null && enddate != null && !startdate.isEmpty() && !enddate.isEmpty()) {
            LocalDateTime start = LocalDate.parse(startdate).atStartOfDay();
            LocalDateTime end = LocalDate.parse(enddate).atTime(23, 59, 59);
            return attendanceRepository.findByClockInBetween(start, end);
        }
        return attendanceRepository.findAll();
    }

    @Override
    public List<Attendance> findByEmployee(Integer employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }
}
