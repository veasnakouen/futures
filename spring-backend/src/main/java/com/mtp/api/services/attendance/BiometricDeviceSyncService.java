package com.mtp.api.services.attendance;

import com.mtp.api.models.Attendance;
import com.mtp.api.models.BiometricDevice;
import com.mtp.api.models.Employee;
import com.mtp.api.repositories.AttendanceRepository;
import com.mtp.api.repositories.BiometricDeviceRepository;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.utils.ZkDeviceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class BiometricDeviceSyncService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final BiometricDeviceRepository deviceRepository;

    @Transactional
    public void syncDeviceData(String deviceIp) {
        BiometricDevice device = deviceRepository.findFirstByIpAddress(deviceIp);
        if (device == null) {
            log.error("Sync Failed: Device with IP {} not registered.", deviceIp);
            return;
        }

        ZkDeviceClient client = new ZkDeviceClient(device.getIpAddress(), device.getPort());

        try {
            log.info("Connecting to hardware node: {}", deviceIp);
            List<com.mtp.api.utils.zk.ZkUser> remoteUsers = client.fetchUserList();
            Map<String, String> nameMap = new HashMap<>();
            for (com.mtp.api.utils.zk.ZkUser u : remoteUsers) {
                nameMap.put(u.userId, u.name);
            }
            log.info("[ZK-Registry] Found {} names on hardware.", remoteUsers.size());

            List<com.mtp.api.utils.zk.ZkAttendanceLog> remoteLogs = client.fetchLogs();

            if (remoteLogs.isEmpty()) {
                log.info("No new logs found on device: {}", deviceIp);
            } else {
                log.info("[ZK-Ingest] Starting high-speed sync for {} records...", remoteLogs.size());
                int count = 0;

                Map<String, Employee> employeeCache = new HashMap<>();
                Map<Integer, Attendance> activeAttendanceCache = new HashMap<>();

                attendanceRepository.findByClockOutIsNull().forEach(a -> activeAttendanceCache.put(a.getEmployee().getId(), a));

                for (com.mtp.api.utils.zk.ZkAttendanceLog logEntry : remoteLogs) {
                    Employee emp = employeeCache.get(logEntry.userId);

                    if (emp == null) {
                        String cleanId = logEntry.userId.replaceAll("^0+", "");
                        Optional<Employee> empOpt = employeeRepository.findByIdNo(logEntry.userId)
                                .or(() -> employeeRepository.findByIdNo(cleanId));

                        if (empOpt.isPresent()) {
                            emp = empOpt.get();
                        } else {
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

                    Attendance active = activeAttendanceCache.get(emp.getId());
                    if (active != null && active.getClockIn().toLocalDate().equals(logEntry.timestamp.toLocalDate())) {
                        if (logEntry.timestamp.isAfter(active.getClockIn().plusMinutes(1))) {
                            active.setClockOut(logEntry.timestamp);
                            active.setNote(active.getNote() + " | Biometric Out [" + device.getName() + "]");
                            attendanceRepository.save(active);
                            activeAttendanceCache.remove(emp.getId());
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

    @Scheduled(fixedRate = 900000, initialDelay = 60000)
    @Async("asyncExecutor")
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
