package com.mtp.api.services.attendance;

import com.mtp.api.models.Department;
import com.mtp.api.repositories.DepartmentRepository;
import com.mtp.api.repositories.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class GeoLocationValidator {

    private final DepartmentRepository departmentRepository;
    private final SystemSettingRepository systemSettingRepository;

    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public ResponseEntity<String> validateLocation(Integer departmentId, Double lat, Double lng) {
        if (lat == null || lng == null) {
            return null;
        }

        Double targetLat = null;
        Double targetLng = null;

        if (departmentId != null && departmentId > 0) {
            Department dept = departmentRepository.findById(departmentId).orElse(null);
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
            if (distance > 100.0) {
                return ResponseEntity.status(403).body("Location Validation Failed: You are "
                        + String.format("%.0f", distance)
                        + " meters away from the department. Maximum allowed is 100 meters.");
            }
        }

        return null;
    }
}
