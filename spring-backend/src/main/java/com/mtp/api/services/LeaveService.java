package com.mtp.api.services;

import com.mtp.api.models.Employee;
import com.mtp.api.models.LeaveBalance;
import com.mtp.api.models.LeaveRequest;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.LeaveBalanceRepository;
import com.mtp.api.repositories.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Calculate dynamic leave balance based on tenure
    public LeaveBalance calculateAndGetBalance(Integer employeeId, int year) {
        Employee emp = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found"));
        
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year)
                .orElse(new LeaveBalance());

        if (balance.getId() == null) {
            balance.setEmployee(emp);
            balance.setYear(year);
            balance.setUsedAnnualLeave(0);
            balance.setUsedSickLeave(0);
            balance.setUsedSpecialLeave(0);
        }

        // Logic: 18 days base + 1 AL per 3 years
        double baseAL = 18.0;
        if (emp.getJoinDate() != null) {
            long yearsWorked = ChronoUnit.YEARS.between(emp.getJoinDate(), LocalDate.of(year, 12, 31));
            if (yearsWorked >= 3) {
                baseAL += (yearsWorked / 3);
            }
        }
        balance.setTotalAnnualLeave(baseAL);
        balance.setTotalSickLeave(14.0);
        balance.setTotalSpecialLeave(7.0);

        return leaveBalanceRepository.save(balance);
    }

    public LeaveRequest submitRequest(LeaveRequest req, Integer employeeId) {
        Employee emp = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found: ID=" + employeeId));
        req.setEmployee(emp);
        req.setStatus("PENDING_MANAGER");
        req.setManagerApprovalStatus("PENDING");
        req.setChairmanApprovalStatus("PENDING");
        
        // Dynamically lookup the manager's ID based on the employee's manager name string
        if (emp.getManager() != null && !emp.getManager().trim().isEmpty()) {
            employeeRepository.findByFullNameIgnoreCase(emp.getManager().trim())
                .ifPresent(managerEmp -> req.setManagerId(managerEmp.getId()));
        }
        
        // Chairman lookup: For this prototype, we'll try to find an employee with the title 'Chairman'
        // If not found, it stays null, and SUPER_ADMINs can still approve it globally.
        employeeRepository.findAll().stream()
            .filter(e -> e.getTitle() != null && e.getTitle().equalsIgnoreCase("Chairman"))
            .findFirst()
            .ifPresent(chairmanEmp -> req.setChairmanId(chairmanEmp.getId()));
        
        return leaveRequestRepository.save(req);
    }

    public LeaveRequest approveByManager(Integer requestId, Integer managerId, boolean approved, String comment) {
        LeaveRequest req = leaveRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        if (!"PENDING_MANAGER".equals(req.getStatus())) {
            throw new RuntimeException("Request not waiting for manager approval");
        }

        if (approved) {
            req.setManagerApprovalStatus("APPROVED");
            req.setStatus("PENDING_CHAIRMAN");
        } else {
            req.setManagerApprovalStatus("REJECTED");
            req.setStatus("REJECTED");
            req.setAdminComment(comment);
        }
        return leaveRequestRepository.save(req);
    }

    public LeaveRequest approveByChairman(Integer requestId, Integer chairmanId, boolean approved, String comment) {
        LeaveRequest req = leaveRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        if (!"PENDING_CHAIRMAN".equals(req.getStatus())) {
            throw new RuntimeException("Request not waiting for chairman approval");
        }

        if (approved) {
            req.setChairmanApprovalStatus("APPROVED");
            req.setStatus("APPROVED");
            // Deduct balance
            deductBalance(req);
        } else {
            req.setChairmanApprovalStatus("REJECTED");
            req.setStatus("REJECTED");
            req.setAdminComment(comment);
        }
        return leaveRequestRepository.save(req);
    }

    private void deductBalance(LeaveRequest req) {
        int year = req.getStartDate().getYear();
        LeaveBalance balance = calculateAndGetBalance(req.getEmployee().getId(), year);

        double durationDays = "HALF_MORNING".equals(req.getDuration()) || "HALF_AFTERNOON".equals(req.getDuration()) ? 0.5 : 1.0;
        
        // Rough estimate of days if FULL_DAY spans multiple days, excluding weekends
        if ("FULL_DAY".equals(req.getDuration()) && req.getEndDate() != null && req.getStartDate() != null) {
            java.time.LocalDate start = req.getStartDate().toLocalDate();
            java.time.LocalDate end = req.getEndDate().toLocalDate();
            long days = 0;
            java.time.LocalDate current = start;
            while (!current.isAfter(end)) {
                if (current.getDayOfWeek() != java.time.DayOfWeek.SATURDAY && current.getDayOfWeek() != java.time.DayOfWeek.SUNDAY) {
                    days++;
                }
                current = current.plusDays(1);
            }
            durationDays = days;
        }

        if ("Annual".equalsIgnoreCase(req.getLeaveType())) {
            balance.setUsedAnnualLeave(balance.getUsedAnnualLeave() + durationDays);
        } else if ("Sick".equalsIgnoreCase(req.getLeaveType())) {
            balance.setUsedSickLeave(balance.getUsedSickLeave() + durationDays);
        } else if ("Special".equalsIgnoreCase(req.getLeaveType())) {
            balance.setUsedSpecialLeave(balance.getUsedSpecialLeave() + durationDays);
        }
        leaveBalanceRepository.save(balance);
    }
}
