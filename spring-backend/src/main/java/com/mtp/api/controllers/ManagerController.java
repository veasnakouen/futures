package com.mtp.api.controllers;

import com.mtp.api.models.Employee;
import com.mtp.api.models.LeaveRequest;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.LeaveRequestRepository;
import com.mtp.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr/manager")
public class ManagerController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    private Optional<Employee> getCurrentEmployee() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        var userOpt = userRepository.findByUserName(username);
        String email = userOpt.map(com.mtp.api.models.User::getEmail).orElse(username);

        return employeeRepository.findByEmailIgnoreCase(email)
                .or(() -> employeeRepository.findByEmailIgnoreCase(username));
    }

    private Optional<String> getCurrentManagerName(Optional<Employee> currentEmpOpt) {
        if (currentEmpOpt.isPresent()) {
            Employee emp = currentEmpOpt.get();
            return Optional.of(emp.getFirstNameEnglish() + " " + emp.getLastNameEnglish());
        }
        return Optional.empty();
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Employee>> getDirectReports() {
        Optional<Employee> currentEmp = getCurrentEmployee();
        Optional<String> managerName = getCurrentManagerName(currentEmp);
        
        if (managerName.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        List<Employee> reports = employeeRepository.findByManagerIgnoreCase(managerName.get());
        
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/leaves/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaves() {
        Optional<Employee> currentEmp = getCurrentEmployee();
        Optional<String> managerName = getCurrentManagerName(currentEmp);
        
        if (managerName.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        List<Employee> reports = employeeRepository.findByManagerIgnoreCase(managerName.get());
        
        if (reports.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        List<Integer> reportIds = reports.stream().map(Employee::getId).collect(Collectors.toList());
        
        List<LeaveRequest> pendingLeaves = leaveRequestRepository.findByStatus("Pending").stream()
            .filter(leave -> leave.getEmployee() != null && reportIds.contains(leave.getEmployee().getId()))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(pendingLeaves);
    }
}
