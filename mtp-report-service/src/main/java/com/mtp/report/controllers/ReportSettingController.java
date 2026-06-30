package com.mtp.report.controllers;

import com.mtp.report.models.ReportSetting;
import com.mtp.report.services.ReportSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/report-builder/settings")
public class ReportSettingController {

    private final ReportSettingService reportSettingService;

    @Autowired
    public ReportSettingController(ReportSettingService reportSettingService) {
        this.reportSettingService = reportSettingService;
    }

    private String determineTargetUserId(String requestedTargetUserId, Authentication authentication) {
        String loggedInUserId = authentication.getName();
        
        if (requestedTargetUserId == null || requestedTargetUserId.trim().isEmpty() || requestedTargetUserId.equals(loggedInUserId)) {
            return loggedInUserId;
        }

        // Check if user is admin or superadmin to allow querying/setting for other users
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        boolean isAdmin = authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SUPERADMIN") || a.getAuthority().equals("ADMIN") || a.getAuthority().equals("SUPERADMIN"));

        if (isAdmin) {
            return requestedTargetUserId;
        } else {
            // Non-admins can only see their own settings
            return loggedInUserId;
        }
    }

    @GetMapping("/{reportName}")
    public ResponseEntity<?> getSettings(
            @PathVariable String reportName,
            @RequestParam(required = false) String targetUserId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }

        String userIdToUse = determineTargetUserId(targetUserId, authentication);
        ReportSetting setting = reportSettingService.getSettings(userIdToUse, reportName);
        return ResponseEntity.ok(setting);
    }

    @GetMapping("/custom-reports")
    public ResponseEntity<?> getCustomReports(@RequestParam(required = false) String targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }

        String userIdToUse = determineTargetUserId(targetUserId, authentication);
        java.util.List<ReportSetting> customReports = reportSettingService.getCustomReports(userIdToUse);
        return ResponseEntity.ok(customReports);
    }

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @PostMapping("/{reportName}")
    public ResponseEntity<?> saveSettings(
            @PathVariable String reportName,
            @RequestParam(required = false) String targetUserId,
            @RequestBody Map<String, Object> payload) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }

        String userIdToUse = determineTargetUserId(targetUserId, authentication);
        
        // Extract preferences JSON string from payload
        String preferencesJson = "{}";
        if (payload != null && payload.containsKey("preferences")) {
            Object prefs = payload.get("preferences");
            if (prefs instanceof String) {
                preferencesJson = (String) prefs;
            } else {
                try {
                    preferencesJson = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(prefs);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid preferences format"));
                }
            }
        }

        ReportSetting savedSetting = reportSettingService.saveSettings(userIdToUse, reportName, preferencesJson);

        // Audit Logging
        try {
            String loggedUser = authentication.getName();
            String action = "Updated Report Settings";
            String target = reportName.equalsIgnoreCase("all") ? "Global Report Preferences" : "Report: " + reportName;
            
            String sql = "INSERT INTO AuditLogs (loggedUser, action, target, timestamp, type) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, loggedUser, action, target, java.time.LocalDateTime.now(), "warning");
        } catch (Exception e) {
            System.err.println("Failed to insert AuditLog for ReportSetting: " + e.getMessage());
        }

        return ResponseEntity.ok(savedSetting);
    }
}
