package com.mtp.api.controllers;

import com.mtp.api.models.AuditLog;
import com.mtp.api.models.Employee;
import com.mtp.api.repositories.AuditLogRepository;
import com.mtp.api.repositories.EmployeeRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compliance")
@CrossOrigin(origins = "*", allowedHeaders = "*")
// @PreAuthorize("hasAuthority('SYSTEM_CONFIG')")
@Slf4j
public class ComplianceController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private int lastScanScore = 94;
    private LocalDateTime lastScanTime = LocalDateTime.now().minusDays(8);

    @PostConstruct
    public void seedInitialLogs() {
        if (auditLogRepository.count() == 0) {
            log.info("Compliance Service: Seeding initial immutable audit logs...");
            
            AuditLog log1 = new AuditLog();
            log1.setLoggedUser("Admin_Michael");
            log1.setAction("Modified Payroll DTO");
            log1.setTarget("Salary Scale E-4");
            log1.setTimestamp(LocalDateTime.now().minusMinutes(12));
            log1.setType("info");
            auditLogRepository.save(log1);

            AuditLog log2 = new AuditLog();
            log2.setLoggedUser("System_Sync");
            log2.setAction("External ID Mismatch");
            log2.setTarget("Azure AD Connect");
            log2.setTimestamp(LocalDateTime.now().minusMinutes(45));
            log2.setType("warning");
            auditLogRepository.save(log2);

            AuditLog log3 = new AuditLog();
            log3.setLoggedUser("HR_Sarah");
            log3.setAction("Document Access");
            log3.setTarget("Legal_Contract_J92.pdf");
            log3.setTimestamp(LocalDateTime.now().minusHours(1));
            log3.setType("info");
            auditLogRepository.save(log3);

            AuditLog log4 = new AuditLog();
            log4.setLoggedUser("Admin_Michael");
            log4.setAction("Role Assigned");
            log4.setTarget("Security_Lead");
            log4.setTimestamp(LocalDateTime.now().minusHours(3));
            log4.setType("critical");
            auditLogRepository.save(log4);

            log.info("Compliance Service: Initial audit logs successfully seeded!");
        }
    }

    @GetMapping("/logs")
    public List<AuditLog> getAuditLogs() {
        log.info("Compliance Service: Retrieving dynamic immutable audit trail");
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    @GetMapping("/stats")
    public Map<String, Object> getComplianceStats() {
        log.info("Compliance Service: Fetching governance status and metrics");
        Map<String, Object> stats = new HashMap<>();
        stats.put("gdprStatus", "Active");
        stats.put("laborLawsStatus", "Active");
        stats.put("lastSecurityReview", lastScanTime.toString());
        stats.put("score", lastScanScore);
        stats.put("status", lastScanScore >= 90 ? "Compliant" : "Warning");
        return stats;
    }

    @PostMapping("/scan")
    public Map<String, Object> executeSecurityScan() {
        log.info("Compliance Service: Initiating deep cybersecurity compliance scan of active workforce...");
        
        List<Employee> employees = employeeRepository.findAll();
        int totalEmployees = employees.size();
        int complianceViolations = 0;

        for (Employee emp : employees) {
            boolean isViolated = false;
            // Criteria 1: Missing System ID
            if (emp.getIdNo() == null || emp.getIdNo().trim().isEmpty()) {
                isViolated = true;
            }
            // Criteria 2: Missing Core Primary Contact
            if (emp.getPhoneNumber() == null || emp.getPhoneNumber().trim().isEmpty()) {
                isViolated = true;
            }
            // Criteria 3: Missing Emergency Contact Numbers
            if (emp.getEmergencyContactPhone() == null || emp.getEmergencyContactPhone().trim().isEmpty()) {
                isViolated = true;
            }

            if (isViolated) {
                complianceViolations++;
            }
        }

        // Calculate score: starts at 100%, deducts 5% per incomplete dossier
        int newScore = 100;
        if (totalEmployees > 0) {
            newScore = 100 - (complianceViolations * 5);
            if (newScore < 40) newScore = 40; // Floor at 40%
        }

        lastScanScore = newScore;
        lastScanTime = LocalDateTime.now();

        // Write an immutable entry to the Audit Log database
        AuditLog scanLog = new AuditLog();
        scanLog.setLoggedUser("System_Scan");
        scanLog.setAction("Executed Cybersecurity Review");
        scanLog.setTarget("Workforce Directory Scan (Score: " + newScore + "%)");
        scanLog.setTimestamp(LocalDateTime.now());
        scanLog.setType("info");
        auditLogRepository.save(scanLog);

        log.info("Compliance Service: Scan complete! Score={} Violations={}", newScore, complianceViolations);

        return getComplianceStats();
    }
}
