package com.mtp.api.services;

import com.mtp.api.dto.ManualAttendanceRequest;
import com.mtp.api.dto.BiometricRequest;
import com.mtp.api.models.Attendance;
import org.springframework.http.ResponseEntity;

public interface AttendanceService {
    ResponseEntity<?> processBiometricCheck(BiometricRequest request);
    Attendance clockIn(Integer employeeId, String location, String note);
    Attendance clockOut(Integer employeeId, String note);
    Attendance submitManualLog(ManualAttendanceRequest request);
    void syncDeviceData(String deviceIp);
    boolean testConnection(String ipAddress, int port);
    java.util.List<com.mtp.api.utils.ZkDeviceClient.ZkUser> getDeviceUsers(String deviceIp);
    
    // Device Management
    java.util.List<com.mtp.api.models.BiometricDevice> getAllDevices();
    com.mtp.api.models.BiometricDevice saveDevice(com.mtp.api.models.BiometricDevice device);
    void deleteDevice(Integer id);
    String probeDevice(String ipAddress, int port);
}
