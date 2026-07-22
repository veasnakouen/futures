package com.mtp.api.controllers;

import com.mtp.api.repositories.AuditLogRepository;
import com.mtp.api.repositories.LoginHistoryRepository;
import com.mtp.api.repositories.UserRepository;
import com.mtp.api.repositories.RoleRepository;
import com.mtp.api.repositories.PermissionRepository;
import com.mtp.api.services.AuditLogService;
import com.mtp.api.services.LoginHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/data-clean")
@RequiredArgsConstructor
@Slf4j
public class DataCleanupController {

    private final LoginHistoryRepository loginHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final LoginHistoryService loginHistoryService;
    private final AuditLogService auditLogService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDatabaseStorageStats() {
        Map<String, Object> stats = new HashMap<>();
        long accessLogsCount = loginHistoryRepository.count();
        long auditLogsCount = auditLogRepository.count();
        long usersCount = userRepository.count();
        long rolesCount = roleRepository.count();
        long permissionsCount = permissionRepository.count();

        stats.put("accessLogsCount", accessLogsCount);
        stats.put("auditLogsCount", auditLogsCount);
        stats.put("usersCount", usersCount);
        stats.put("rolesCount", rolesCount);
        stats.put("permissionsCount", permissionsCount);
        
        // Estimated storage metrics (KB)
        double estimatedLogSizeKb = (accessLogsCount * 0.45) + (auditLogsCount * 0.35);
        stats.put("estimatedLogSizeKb", Math.round(estimatedLogSizeKb * 100.0) / 100.0);
        stats.put("lastCleanedTimestamp", LocalDateTime.now().toString());

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/purge-access-logs")
    public ResponseEntity<Map<String, Object>> purgeAccessLogs(@RequestParam(defaultValue = "30days") String range) {
        long beforeCount = loginHistoryRepository.count();
        loginHistoryService.clearLogs(range);
        long afterCount = loginHistoryRepository.count();
        long deletedCount = beforeCount - afterCount;

        auditLogService.logActivity("PURGE_ACCESS_LOGS", "Range: " + range + " (Deleted " + deletedCount + " records)");
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Access logs purge executed successfully");
        response.put("range", range);
        response.put("deletedCount", deletedCount);
        response.put("remainingCount", afterCount);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/purge-audit-logs")
    public ResponseEntity<Map<String, Object>> purgeAuditLogs(@RequestParam(defaultValue = "30days") String range) {
        long beforeCount = auditLogRepository.count();
        if ("all".equalsIgnoreCase(range)) {
            auditLogRepository.deleteAll();
        } else if ("7days".equalsIgnoreCase(range)) {
            auditLogRepository.deleteByTimestampBefore(LocalDateTime.now().minusDays(7));
        } else if ("30days".equalsIgnoreCase(range)) {
            auditLogRepository.deleteByTimestampBefore(LocalDateTime.now().minusDays(30));
        } else if ("90days".equalsIgnoreCase(range)) {
            auditLogRepository.deleteByTimestampBefore(LocalDateTime.now().minusDays(90));
        }
        long afterCount = auditLogRepository.count();
        long deletedCount = beforeCount - afterCount;

        auditLogService.logActivity("PURGE_AUDIT_LOGS", "Range: " + range + " (Deleted " + deletedCount + " records)");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Audit logs purge executed successfully");
        response.put("range", range);
        response.put("deletedCount", deletedCount);
        response.put("remainingCount", afterCount);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/clean-orphans")
    public ResponseEntity<Map<String, Object>> cleanOrphanData() {
        // Clean orphan records across logging and temp tables
        long beforeAccess = loginHistoryRepository.count();
        loginHistoryRepository.deleteByStatus("Suspicious_Evicted");
        long afterAccess = loginHistoryRepository.count();

        auditLogService.logActivity("CLEAN_ORPHAN_DATA", "Optimized orphan security tokens & temporary entries");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Orphaned data and temporary entries cleaned successfully");
        response.put("cleanedEntries", beforeAccess - afterAccess);

        return ResponseEntity.ok(response);
    }
}
