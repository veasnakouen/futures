package com.mtp.api.services;

import com.mtp.api.dto.BiometricRequest;
import com.mtp.api.models.Attendance;
import org.springframework.http.ResponseEntity;

public interface AttendanceService {
    ResponseEntity<?> processBiometricCheck(BiometricRequest request);
    Attendance clockIn(Integer employeeId, String location, String note);
    Attendance clockOut(Integer employeeId, String note);
}
