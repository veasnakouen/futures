package com.mtp.api.controllers;

import com.mtp.api.models.LeaveRequest;
import com.mtp.api.repositories.LeaveRequestRepository;
import com.mtp.api.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/hr/leaves")
public class LeaveController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private com.mtp.api.services.LeaveService leaveService;

    @GetMapping
    public List<LeaveRequest> getAll() {
        return leaveRequestRepository.findAll();
    }

    @GetMapping("/employee/{id}")
    public List<LeaveRequest> getByEmployee(@PathVariable Integer id) {
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(id);
    }

    @GetMapping("/employee/{id}/balance/{year}")
    public ResponseEntity<?> getBalance(@PathVariable Integer id, @PathVariable int year) {
        return ResponseEntity.ok(leaveService.calculateAndGetBalance(id, year));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody LeaveRequest request) {
        if (request.getEmployee() == null || request.getEmployee().getId() == null) {
            return ResponseEntity.badRequest().body("Employee ID is required");
        }
        return ResponseEntity.ok(leaveService.submitRequest(request, request.getEmployee().getId()));
    }

    @PutMapping("/{id}/manager-approve")
    public ResponseEntity<?> managerApprove(
            @PathVariable Integer id,
            @RequestParam Integer managerId,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(leaveService.approveByManager(id, managerId, approved, comment));
    }

    @PutMapping("/{id}/chairman-approve")
    public ResponseEntity<?> chairmanApprove(
            @PathVariable Integer id,
            @RequestParam Integer chairmanId,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(leaveService.approveByChairman(id, chairmanId, approved, comment));
    }

    private boolean isAdmin() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ADMIN") || a.getAuthority().equals("SUPER_ADMIN"));
    }

    @GetMapping("/pending/manager/{managerId}")
    public List<LeaveRequest> getPendingForManager(@PathVariable Integer managerId) {
        if (isAdmin()) {
            return leaveRequestRepository.findByStatus("PENDING_MANAGER");
        }
        return leaveRequestRepository.findByManagerIdAndStatusOrderByCreatedAtDesc(managerId, "PENDING_MANAGER");
    }

    @GetMapping("/pending/chairman/{chairmanId}")
    public List<LeaveRequest> getPendingForChairman(@PathVariable Integer chairmanId) {
        if (isAdmin()) {
            return leaveRequestRepository.findByStatus("PENDING_CHAIRMAN");
        }
        return leaveRequestRepository.findByChairmanIdAndStatusOrderByCreatedAtDesc(chairmanId, "PENDING_CHAIRMAN");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return leaveRequestRepository.findById(id).map(req -> {
            req.setStatus(status);
            if ("APPROVED".equalsIgnoreCase(status)) {
                req.setManagerApprovalStatus("APPROVED");
                req.setChairmanApprovalStatus("APPROVED");
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                req.setManagerApprovalStatus("REJECTED");
                req.setChairmanApprovalStatus("REJECTED");
            }
            return ResponseEntity.ok(leaveRequestRepository.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }
}
