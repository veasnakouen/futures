package com.mtp.api.controllers;

import com.mtp.api.models.LeaveRequest;
import com.mtp.api.repositories.LeaveRequestRepository;
import com.mtp.api.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr/leaves")
public class LeaveController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<LeaveRequest> getAll() {
        return leaveRequestRepository.findAll();
    }

    @GetMapping("/employee/{id}")
    public List<LeaveRequest> getByEmployee(@PathVariable Integer id) {
        return leaveRequestRepository.findByEmployeeId(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody LeaveRequest request) {
        if (request.getEmployee() == null || request.getEmployee().getId() == null) {
            return ResponseEntity.badRequest().body("Employee ID is required");
        }
        request.setStatus("Pending");
        return ResponseEntity.ok(leaveRequestRepository.save(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestParam String status, @RequestParam(required = false) String comment) {
        return leaveRequestRepository.findById(id).map(r -> {
            r.setStatus(status);
            r.setAdminComment(comment);
            return ResponseEntity.ok(leaveRequestRepository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }
}
