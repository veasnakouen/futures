package com.mtp.api.services;

import com.mtp.api.models.AuditLog;
import com.mtp.api.repositories.AuditLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Logs an activity to the AuditLog database dynamically pulling the currently authenticated user.
     * 
     * @param action Description of the action (e.g. "Created Employee")
     * @param target Description of the target (e.g. "John Doe #EMP-001")
     * @param type Severity or classification (e.g. "info", "warning", "critical", "success")
     */
    public void logActivity(String action, String target, String type) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = "System";
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                username = auth.getName();
            }

            AuditLog auditLog = new AuditLog();
            auditLog.setLoggedUser(username);
            auditLog.setAction(action);
            auditLog.setTarget(target);
            auditLog.setTimestamp(LocalDateTime.now());
            auditLog.setType(type);

            auditLogRepository.save(auditLog);
            log.info("AuditLog recorded: {} performed [{}] on target [{}]", username, action, target);
        } catch (Exception e) {
            log.error("Failed to write audit log to database", e);
        }
    }
}
