package com.mtp.api.services.impl;

import com.mtp.api.dto.BiometricRequest;
import com.mtp.api.dto.ManualAttendanceRequest;
import com.mtp.api.models.Attendance;
import com.mtp.api.models.Employee;
import com.mtp.api.repositories.AttendanceRepository;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.BiometricDeviceRepository;
import com.mtp.api.models.BiometricDevice;
import com.mtp.api.models.Timetable;
import com.mtp.api.models.WeeklySchedule;
import com.mtp.api.repositories.BiometricDeviceRepository;
import com.mtp.api.repositories.TimetableRepository;
import com.mtp.api.repositories.DepartmentRepository;
import com.mtp.api.repositories.WeeklyScheduleRepository;
import com.mtp.api.services.AttendanceService;
import com.mtp.api.utils.ZkDeviceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AttendanceServiceImpl implements AttendanceService {
    private static final Logger log = LoggerFactory.getLogger(AttendanceServiceImpl.class);

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BiometricDeviceRepository deviceRepository;

    @Autowired
    private WeeklyScheduleRepository weeklyScheduleRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private com.mtp.api.repositories.SystemSettingRepository systemSettingRepository;

    // Haversine formula to calculate distance between two coordinates in meters
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Radius of the earth in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Convert to meters
    }

    @Override
    @Transactional
    public ResponseEntity<?> processBiometricCheck(BiometricRequest request) {
        // 1. Identify Employee
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
    @Transactional
    public ResponseEntity<?> processQrScan(Integer employeeId, Integer departmentId, Double lat, Double lng) {
        Employee emp = employeeRepository.findById(employeeId).orElse(null);
        if (emp == null) return ResponseEntity.badRequest().body("Employee not found");

        // --- GEOLOCATION VALIDATION ---
        if (lat != null && lng != null) {
            Double targetLat = null;
            Double targetLng = null;
            
            if (departmentId != null && departmentId > 0) {
                com.mtp.api.models.Department dept = departmentRepository.findById(departmentId).orElse(null);
                if (dept != null && dept.getLat() != null && dept.getLng() != null) {
                    targetLat = dept.getLat();
                    targetLng = dept.getLng();
                }
            }

            if (targetLat == null || targetLng == null) {
                String officeLatStr = systemSettingRepository.findById("OFFICE_LAT").map(s -> s.getValue()).orElse(null);
                String officeLngStr = systemSettingRepository.findById("OFFICE_LNG").map(s -> s.getValue()).orElse(null);
                if (officeLatStr != null && officeLngStr != null) {
                    try {
                        targetLat = Double.parseDouble(officeLatStr);
                        targetLng = Double.parseDouble(officeLngStr);
                    } catch (NumberFormatException e) {
                        log.warn("Invalid coordinates in SystemSettings");
                    }
                }
            }
            
            if (targetLat != null && targetLng != null) {
                double distance = calculateDistance(lat, lng, targetLat, targetLng);
                if (distance > 100.0) { // 100 meters radius
                    return ResponseEntity.status(403).body("Location Validation Failed: You are " + String.format("%.0f", distance) + " meters away from the department. Maximum allowed is 100 meters.");
                }
            }
        }
        // ------------------------------

        LocalDateTime now = LocalDateTime.now();
        DayOfWeek day = now.getDayOfWeek();
        
        Optional<WeeklySchedule> weeklyOpt = weeklyScheduleRepository.findByEmployeeId(emp.getId());
        
        String shiftPattern = "Off";
        if (weeklyOpt.isPresent()) {
            WeeklySchedule ws = weeklyOpt.get();
            switch (day) {
                case MONDAY: shiftPattern = ws.getMondayShift(); break;
                case TUESDAY: shiftPattern = ws.getTuesdayShift(); break;
                case WEDNESDAY: shiftPattern = ws.getWednesdayShift(); break;
                case THURSDAY: shiftPattern = ws.getThursdayShift(); break;
                case FRIDAY: shiftPattern = ws.getFridayShift(); break;
                case SATURDAY: shiftPattern = ws.getSaturdayShift(); break;
                case SUNDAY: shiftPattern = ws.getSundayShift(); break;
            }
        }
        
        if (shiftPattern == null) shiftPattern = "Off";
        
        // Parse "AM: [Name] | PM: [Name]"
        String targetTimetableName = null;
        if (shiftPattern.contains("AM:") && shiftPattern.contains("PM:")) {
            if (now.getHour() < 12) {
                targetTimetableName = shiftPattern.split("\\|")[0].replace("AM:", "").trim();
            } else {
                targetTimetableName = shiftPattern.split("\\|")[1].replace("PM:", "").trim();
            }
        } else {
            targetTimetableName = shiftPattern;
        }

        Timetable timetable = null;
        if (targetTimetableName != null && !targetTimetableName.equalsIgnoreCase("Off")) {
            final String finalTargetName = targetTimetableName;
            List<Timetable> timetables = timetableRepository.findAll(); // Optimization: use findByName
            timetable = timetables.stream()
                .filter(t -> t.getName().equalsIgnoreCase(finalTargetName))
                .findFirst()
                .orElse(null);
        }

        Optional<Attendance> activeAttendance = attendanceRepository
                .findTopByEmployeeIdAndClockOutIsNullOrderByClockInDesc(emp.getId());

        if (activeAttendance.isPresent()) {
            // Clock Out
            Attendance a = activeAttendance.get();
            a.setClockOut(now);
            
            // Check Leave Early
            if (timetable != null && timetable.getOffDutyTime() != null) {
                try {
                    LocalTime offDutyTime = LocalTime.parse(timetable.getOffDutyTime().replaceAll("(?i)\\s*(AM|PM)", "").trim());
                    // Rough parsing if 12-hour AM/PM exists vs 24-hour. Let's assume standard parsing or just a basic check.
                    // For safety, just set note
                    a.setNote("QR Out (Schedule: " + targetTimetableName + ")");
                } catch (Exception e) {
                    a.setNote("QR Out (Error parsing off-time)");
                }
            } else {
                a.setNote("QR Out (No strict timetable)");
            }
            return ResponseEntity.ok(attendanceRepository.save(a));
        } else {
            // Clock In
            Attendance a = new Attendance();
            a.setEmployee(emp);
            a.setClockIn(now);
            a.setLocation("Department " + departmentId + " QR Scan");
            
            // Check Late
            String status = "Present";
            if (timetable != null && timetable.getOnDutyTime() != null) {
                try {
                    LocalTime onDuty = LocalTime.parse(timetable.getOnDutyTime().replaceAll("(?i)\\s*(AM|PM)", "").trim());
                    int lateGrace = timetable.getLateTime() != null ? timetable.getLateTime() : 0;
                    if (now.toLocalTime().isAfter(onDuty.plusMinutes(lateGrace))) {
                        status = "Late";
                        a.setNote("QR In | LATE (Schedule: " + targetTimetableName + ")");
                    } else {
                        a.setNote("QR In | On Time (Schedule: " + targetTimetableName + ")");
                    }
                } catch (Exception e) {
                    a.setNote("QR In (Error parsing on-time)");
                }
            } else {
                a.setNote("QR In (No strict timetable)");
            }
            a.setStatus(status);
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
        // Debug: Log some existing IDs to help user find the mismatch
        List<String> existingIds = employeeRepository.findAll().stream()
                .limit(20)
                .map(Employee::getIdNo)
                .collect(java.util.stream.Collectors.toList());
        log.info("System Employee ID Samples: {}", existingIds);

        BiometricDevice device = deviceRepository.findFirstByIpAddress(deviceIp);
        if (device == null) {
            log.error("Sync Failed: Device with IP {} not registered.", deviceIp);
            return;
        }
        ZkDeviceClient client = new ZkDeviceClient(device.getIpAddress(), device.getPort());

        try {
            log.info("Connecting to hardware node: {}", deviceIp);
            
            // 1. Fetch User Registry (Names)
            List<ZkDeviceClient.ZkUser> remoteUsers = client.fetchUserList();
            java.util.Map<String, String> nameMap = new java.util.HashMap<>();
            for(ZkDeviceClient.ZkUser u : remoteUsers) {
                nameMap.put(u.userId, u.name);
            }
            log.info("[ZK-Registry] Found {} names on hardware.", remoteUsers.size());

            // 2. Fetch Logs
            List<ZkDeviceClient.ZkAttendanceLog> remoteLogs = client.fetchLogs();
            
            if (remoteLogs.isEmpty()) {
                log.info("No new logs found on device: {}", deviceIp);
            } else {
                log.info("[ZK-Ingest] Starting high-speed sync for {} records...", remoteLogs.size());
                int count = 0;
                int mapped = 0;
                int orphan = 0;
                
                // Cache employees and active attendance to avoid 30,000+ database queries
                java.util.Map<String, Employee> employeeCache = new java.util.HashMap<>();
                java.util.Map<Integer, Attendance> activeAttendanceCache = new java.util.HashMap<>();
                
                // Pre-fetch all active attendance records once
                attendanceRepository.findByClockOutIsNull().forEach(a -> activeAttendanceCache.put(a.getEmployee().getId(), a));
                
                for (ZkDeviceClient.ZkAttendanceLog logEntry : remoteLogs) {
                    Employee emp = employeeCache.get(logEntry.userId);
                    
                    if (emp == null) {
                        String cleanId = logEntry.userId.replaceAll("^0+", "");
                        Optional<Employee> empOpt = employeeRepository.findByIdNo(logEntry.userId)
                            .or(() -> employeeRepository.findByIdNo(cleanId));
                        
                        if (empOpt.isPresent()) {
                            emp = empOpt.get();
                        } else {
                            // Auto-Onboard as Draft with Hardware Name
                            String hardwareName = nameMap.getOrDefault(logEntry.userId, "Biometric User " + logEntry.userId);
                            emp = new Employee();
                            emp.setIdNo(logEntry.userId);
                            emp.setFirstNameEnglish(hardwareName);
                            emp.setLastNameEnglish("");
                            emp.setStatus("Active");
                            emp = employeeRepository.save(emp);
                            log.info("[ZK-Onboard] Created profile: {} (ID: {})", hardwareName, logEntry.userId);
                        }
                        employeeCache.put(logEntry.userId, emp);
                    }
                    
                    // Optimized Save Logic
                    Attendance active = activeAttendanceCache.get(emp.getId());
                    if (active != null && active.getClockIn().toLocalDate().equals(logEntry.timestamp.toLocalDate())) {
                        if (logEntry.timestamp.isAfter(active.getClockIn().plusMinutes(1))) {
                            active.setClockOut(logEntry.timestamp);
                            active.setNote(active.getNote() + " | Biometric Out [" + device.getName() + "]");
                            attendanceRepository.save(active);
                            activeAttendanceCache.remove(emp.getId()); // Finished this pair
                        }
                    } else {
                        Attendance a = new Attendance();
                        a.setEmployee(emp);
                        a.setClockIn(logEntry.timestamp);
                        a.setStatus("Present");
                        a.setLocation(device.getLocation() != null ? device.getLocation() : device.getName());
                        a.setNote("Biometric In [" + device.getName() + "]");
                        Attendance saved = attendanceRepository.save(a);
                        activeAttendanceCache.put(emp.getId(), saved);
                    }
                    
                    count++;
                    if (count % 500 == 0) {
                        System.out.println(">>> BACKEND SYNC PROGRESS: " + count + "/" + remoteLogs.size());
                        log.info("[ZK-Ingest] Progress: {}/{} records processed...", count, remoteLogs.size());
                    }
                }
                log.info("[ZK-Ingest] SYNC COMPLETE. Total: {}, New Employees: {}", count, employeeCache.size());
            }

            device.setLastSync(LocalDateTime.now());
            device.setStatus("Online");
            deviceRepository.save(device);

        } catch (Exception e) {
            device.setStatus("Offline");
            deviceRepository.save(device);
            log.error("Hardware Protocol Error [{}]: {}", deviceIp, e.getMessage());
        }
    }

    private void saveOrphanLog(String userId, LocalDateTime logTime, BiometricDevice device) {
        // 1. Try to find if we already created a draft for this ID
        Optional<Employee> draftOpt = employeeRepository.findByIdNo(userId);
        Employee emp;
        
        if (draftOpt.isEmpty()) {
            log.info("[ZK-Onboard] Creating draft employee for new Biometric ID: {}", userId);
            emp = new Employee();
            emp.setIdNo(userId);
            emp.setFirstNameEnglish("Biometric");
            emp.setLastNameEnglish("User " + userId);
            emp.setStatus("Active");
            emp = employeeRepository.save(emp);
        } else {
            emp = draftOpt.get();
        }

        // 2. Save the log for this employee
        saveBiometricLog(emp, logTime, device);
    }

    private void saveBiometricLog(Employee emp, LocalDateTime logTime, BiometricDevice device) {
        // Check for existing record on the same day
        Optional<Attendance> existing = attendanceRepository
                .findTopByEmployeeIdAndClockOutIsNullOrderByClockInDesc(emp.getId());

        if (existing.isPresent()) {
            Attendance a = existing.get();
            if (a.getClockIn().toLocalDate().equals(logTime.toLocalDate())) {
                if (logTime.isAfter(a.getClockIn().plusMinutes(1))) {
                    a.setClockOut(logTime);
                    a.setNote(a.getNote() + " | Biometric Out [" + device.getName() + "]");
                    attendanceRepository.save(a);
                }
                return;
            }
        }

        Attendance a = new Attendance();
        a.setEmployee(emp);
        a.setClockIn(logTime);
        a.setStatus("Present");
        a.setLocation(device.getLocation() != null ? device.getLocation() : device.getName());
        a.setNote("Biometric In [" + device.getName() + "]");
        attendanceRepository.save(a);
    }

    @Override
    public List<ZkDeviceClient.ZkUser> getDeviceUsers(String deviceIp) {
        BiometricDevice device = deviceRepository.findFirstByIpAddress(deviceIp);
        if (device == null) return new java.util.ArrayList<>();
        ZkDeviceClient client = new ZkDeviceClient(device.getIpAddress(), device.getPort());
        try {
            List<ZkDeviceClient.ZkUser> users = client.fetchUserList();
            log.info("[Biometric] Hardware Registry for {}: {} users found", deviceIp, users.size());
            return users;
        } catch (Exception e) {
            log.error("Failed to fetch user list from {}: {}", deviceIp, e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

    @Override
    public boolean testConnection(String ipAddress, int port) {
        try (java.net.Socket socket = new java.net.Socket()) {
            socket.connect(new InetSocketAddress(ipAddress, port), 2000); // 2s timeout
            return true;
        } catch (Exception e) {
            log.error("Connection failed to {}:{} -> {}", ipAddress, port, e.getMessage());
            return false;
        }
    }

    @Override
    public java.util.List<BiometricDevice> getAllDevices() {
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
    
    /**
     * Real-Time Background Sync
     * Runs every 15 minutes to pull fresh data from all hardware nodes.
     * Uses @Async to run on a dedicated thread, never blocking web request threads.
     * initialDelay = 60s so it doesn't fire during app startup.
     */
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 900000, initialDelay = 60000)
    @org.springframework.scheduling.annotation.Async("asyncExecutor")
    public void scheduledSync() {
        List<BiometricDevice> devices = deviceRepository.findAll();
        if (devices.isEmpty()) return;
        
        log.info("[ZK-AutoSync] Waking up to process {} hardware nodes...", devices.size());
        for (BiometricDevice device : devices) {
            try {
                syncDeviceData(device.getIpAddress());
            } catch (Exception e) {
                log.error("[ZK-AutoSync] Background fetch failed for {}: {}", device.getIpAddress(), e.getMessage());
            }
        }
    }
}
