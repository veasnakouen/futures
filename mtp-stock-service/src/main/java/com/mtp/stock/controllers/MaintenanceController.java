package com.mtp.stock.controllers;

import com.mtp.stock.models.*;
import com.mtp.stock.services.MaintenanceWorkflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/maintenance")
public class MaintenanceController {

    private final MaintenanceWorkflowService workflowService;

    public MaintenanceController(MaintenanceWorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @PostMapping("/report")
    public ResponseEntity<MaintenanceTicket> reportBrokenAsset(@RequestBody Map<String, Object> payload) {
        Integer assetId = (Integer) payload.get("assetId");
        String issueDescription = (String) payload.get("issueDescription");
        return ResponseEntity.ok(workflowService.reportBrokenAsset(assetId, issueDescription));
    }

    @PostMapping("/assess")
    public ResponseEntity<ITAssessment> submitAssessment(@RequestBody Map<String, Object> payload) {
        Long ticketId = Long.valueOf(payload.get("ticketId").toString());
        String findings = (String) payload.get("findings");
        boolean isRepairable = (Boolean) payload.get("isRepairable");
        Double estimatedCost = payload.get("estimatedCost") != null
                ? Double.valueOf(payload.get("estimatedCost").toString())
                : 0.0;

        return ResponseEntity.ok(workflowService.submitITAssessment(ticketId, findings, isRepairable, estimatedCost));
    }

    @PostMapping("/procurement/{id}/approve")
    public ResponseEntity<ProcurementRequest> approveProcurement(@PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        String notes = (String) payload.get("notes");
        return ResponseEntity.ok(workflowService.approveProcurement(id, notes));
    }
}
