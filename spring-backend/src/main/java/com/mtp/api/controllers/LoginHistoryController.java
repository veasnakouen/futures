package com.mtp.api.controllers;

import com.mtp.api.models.LoginHistory;
import com.mtp.api.services.LoginHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/access-logs")
@RequiredArgsConstructor
public class LoginHistoryController {

    private final LoginHistoryService loginHistoryService;

    @GetMapping
    public ResponseEntity<List<LoginHistory>> getAllAccessLogs() {
        return ResponseEntity.ok(loginHistoryService.getAllAccessLogs());
    }

    @GetMapping("/analytics")
    public ResponseEntity<java.util.Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(loginHistoryService.getAnalyticsData());
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/clear")
    public ResponseEntity<Void> clearLogs(@org.springframework.web.bind.annotation.RequestParam String type) {
        loginHistoryService.clearLogs(type);
        return ResponseEntity.noContent().build();
    }
}
