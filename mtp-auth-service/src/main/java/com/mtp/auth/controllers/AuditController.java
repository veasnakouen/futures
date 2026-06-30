package com.mtp.auth.controllers;

import com.mtp.auth.services.LoginHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/audit")
public class AuditController {

    @Autowired
    private LoginHistoryService loginHistoryService;

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs() {
        return ResponseEntity.ok(loginHistoryService.getAllAccessLogs());
    }
}
