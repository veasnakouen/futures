package com.mtp.api.controllers;

import com.mtp.api.repositories.ClientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@Slf4j
public class DashboardController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private com.mtp.api.repositories.PlacementRepository placementRepository;

    @Cacheable(value = "dashboardStats")
    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        try {
            long totalClients = clientRepository.count();
            
            // Distribution by Status
            List<Map<String, Object>> statusDistribution = clientRepository.findAll().stream()
                    .filter(c -> c.getStatus() != null)
                    .collect(Collectors.groupingBy(c -> c.getStatus(), Collectors.counting()))
                    .entrySet().stream()
                    .map(e -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("name", e.getKey());
                        map.put("value", e.getValue());
                        return map;
                    })
                    .collect(Collectors.toList());

            // Distribution by Gender
            List<Map<String, Object>> genderDistribution = clientRepository.findAll().stream()
                    .filter(c -> c.getGender() != null)
                    .collect(Collectors.groupingBy(c -> c.getGender(), Collectors.counting()))
                    .entrySet().stream()
                    .map(e -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("name", e.getKey());
                        map.put("value", e.getValue());
                        return map;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("totalClients", totalClients);
            response.put("statusDistribution", statusDistribution);
            response.put("genderDistribution", genderDistribution);
            response.put("registrationTrend", getMockTrend());
            response.put("activePlacements", placementRepository.count());
            response.put("monthlyReports", 128);

            return response;
        } catch (Exception e) {
            log.error("Dashboard stats error: ", e);
            
            // Return fallback mock data
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("totalClients", 0);
            fallback.put("statusDistribution", new ArrayList<>());
            fallback.put("genderDistribution", new ArrayList<>());
            fallback.put("registrationTrend", getMockTrend());
            fallback.put("activePlacements", 0);
            fallback.put("monthlyReports", 0);
            fallback.put("warning", "Running in fallback mode due to database error");
            
            return fallback;
        }
    }

    private List<Map<String, Object>> getMockTrend() {
        List<Map<String, Object>> trend = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
        Random random = new Random();
        for (String month : months) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", month);
            point.put("count", 10 + random.nextInt(50));
            trend.add(point);
        }
        return trend;
    }
}
