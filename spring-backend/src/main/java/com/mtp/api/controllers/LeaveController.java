package com.mtp.api.controllers;

import com.mtp.api.dto.ApiResponse;
import com.mtp.api.models.LeaveBalance;
import com.mtp.api.models.LeaveRequest;
import com.mtp.api.services.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr/leaves")
@CrossOrigin(origins = "*")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getAll() {
        List<LeaveRequest> leaves = leaveService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Fetched all leave requests successfully", leaves));
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getByEmployee(@PathVariable Integer id) {
        List<LeaveRequest> leaves = leaveService.findByEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Fetched employee leave requests successfully", leaves));
    }

    @GetMapping("/employee/{id}/balance/{year}")
    public ResponseEntity<ApiResponse<LeaveBalance>> getBalance(@PathVariable Integer id, @PathVariable int year) {
        LeaveBalance balance = leaveService.calculateAndGetBalance(id, year);
        return ResponseEntity.ok(ApiResponse.success("Fetched leave balance successfully", balance));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LeaveRequest>> create(@Valid @RequestBody LeaveRequest request) {
        if (request.getEmployee() == null || request.getEmployee().getId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Employee ID is required"));
        }
        LeaveRequest created = leaveService.submitRequest(request, request.getEmployee().getId());
        return ResponseEntity.ok(ApiResponse.success("Leave request submitted successfully", created));
    }

    @PutMapping("/{id}/manager-approve")
    public ResponseEntity<ApiResponse<LeaveRequest>> managerApprove(
            @PathVariable Integer id,
            @RequestParam Integer managerId,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        LeaveRequest result = leaveService.approveByManager(id, managerId, approved, comment);
        return ResponseEntity.ok(ApiResponse.success("Manager approval updated successfully", result));
    }

    @PutMapping("/{id}/chairman-approve")
    public ResponseEntity<ApiResponse<LeaveRequest>> chairmanApprove(
            @PathVariable Integer id,
            @RequestParam Integer chairmanId,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        LeaveRequest result = leaveService.approveByChairman(id, chairmanId, approved, comment);
        return ResponseEntity.ok(ApiResponse.success("Chairman approval updated successfully", result));
    }

    @GetMapping("/pending/manager/{managerId}")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getPendingForManager(@PathVariable Integer managerId) {
        List<LeaveRequest> pending = leaveService.getPendingForManager(managerId);
        return ResponseEntity.ok(ApiResponse.success("Fetched pending manager leaves successfully", pending));
    }

    @GetMapping("/pending/chairman/{chairmanId}")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getPendingForChairman(@PathVariable Integer chairmanId) {
        List<LeaveRequest> pending = leaveService.getPendingForChairman(chairmanId);
        return ResponseEntity.ok(ApiResponse.success("Fetched pending chairman leaves successfully", pending));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LeaveRequest>> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        LeaveRequest updated = leaveService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Leave status updated successfully", updated));
    }
}
