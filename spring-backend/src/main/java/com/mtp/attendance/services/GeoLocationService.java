package com.mtp.attendance.services;

import org.springframework.stereotype.Service;

@Service
public class GeoLocationService {

    private static final double EARTH_RADIUS_METERS = 6371000.0;

    /**
     * Calculates the distance in meters between two GPS coordinates using the Haversine formula.
     *
     * @param lat1 Latitude of point 1 (Employee)
     * @param lon1 Longitude of point 1 (Employee)
     * @param lat2 Latitude of point 2 (Department location)
     * @param lon2 Longitude of point 2 (Department location)
     * @return Distance in meters
     */
    public double calculateDistanceInMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Checks if the employee is within the allowed radius of the department.
     */
    public boolean isWithinRadius(double empLat, double empLon, double deptLat, double deptLon, double allowedRadius) {
        double distance = calculateDistanceInMeters(empLat, empLon, deptLat, deptLon);
        return distance <= allowedRadius;
    }
}
