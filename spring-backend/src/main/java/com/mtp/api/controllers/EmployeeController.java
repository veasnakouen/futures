package com.mtp.api.controllers;

import com.mtp.api.dtos.EmployeeDTO;
import com.mtp.api.dtos.UserLinkDTO;
import com.mtp.api.models.Employee;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.services.EmployeeService;
import com.mtp.api.services.AuditLogService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@Slf4j
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private com.mtp.api.repositories.AttendanceRepository attendanceRepository;

    @Autowired
    private com.mtp.api.repositories.LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/generate-id")
    public ResponseEntity<Map<String, String>> generateStaffId() {
        return ResponseEntity.ok(employeeService.generateStaffId());
    }

    @GetMapping("/link-candidates")
    public List<UserLinkDTO> getLinkCandidates() {
        return employeeService.getLinkCandidates();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentEmployeeProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeService.getCurrentEmployeeProfile(username)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public Page<?> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String contractType,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EmployeeRepository.EmployeeSummary> page = (Page<EmployeeRepository.EmployeeSummary>) employeeRepository
                .findAllSummaries(search, department, status, contractType, pageable);
        if (!page.isEmpty()) {
            String photo = page.getContent().get(0).getPhoto();
            log.info("Employee list fetched. Count: {}, First photo length: {}", page.getTotalElements(),
                    (photo != null ? photo.length() : "NULL"));
        }
        return page;
    }

    @GetMapping("/{id}")
    @Cacheable(value = "employees", key = "#id")
    public ResponseEntity<Employee> getById(@PathVariable Integer id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    @CacheEvict(value = "employees", allEntries = true)
    public Employee create(@Valid @RequestBody EmployeeDTO dto) {
        return employeeService.createEmployee(dto);
    }

    @PutMapping("/{id}")
    @Transactional
    @CacheEvict(value = "employees", allEntries = true)
    public ResponseEntity<Employee> update(@PathVariable Integer id, @Valid @RequestBody EmployeeDTO dto) {
        return employeeService.updateEmployee(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    @CacheEvict(value = "employees", allEntries = true)
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        log.warn("Deleting employee ID: {}", id);
        return employeeRepository.findById(id).map(e -> {
            List<com.mtp.api.models.Attendance> attendances = attendanceRepository.findByEmployeeId(id);
            if (attendances != null && !attendances.isEmpty()) {
                log.info("Deleting {} attendance records for employee ID {}", attendances.size(), id);
                attendanceRepository.deleteAll(attendances);
            }

            List<com.mtp.api.models.LeaveRequest> leaves = leaveRequestRepository
                    .findByEmployeeIdOrderByCreatedAtDesc(id);
            if (leaves != null && !leaves.isEmpty()) {
                log.info("Deleting {} leave request records for employee ID {}", leaves.size(), id);
                leaveRequestRepository.deleteAll(leaves);
            }

            String empDetails = e.getFirstNameEnglish() + " " + e.getLastNameEnglish() + " (" + e.getIdNo() + ")";
            employeeRepository.delete(e);
            log.warn("Employee ID {} permanently removed along with all dependencies", id);
            auditLogService.logActivity("Deleted Employee", empDetails, "critical");
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
