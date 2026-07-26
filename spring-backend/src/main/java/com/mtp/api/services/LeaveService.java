package com.mtp.api.services;

import com.mtp.api.models.Employee;
import com.mtp.api.models.LeaveBalance;
import com.mtp.api.models.LeaveRequest;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.LeaveBalanceRepository;
import com.mtp.api.repositories.LeaveRequestRepository;
import com.mtp.api.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private com.mtp.api.repositories.AnnualLeavePlanRepository annualLeavePlanRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<LeaveRequest> findAll() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> findByEmployee(Integer employeeId) {
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    public List<LeaveRequest> getPendingForManager(Integer managerId) {
        if (isAdmin()) {
            return leaveRequestRepository.findByStatus("PENDING_MANAGER");
        }
        return leaveRequestRepository.findByManagerIdAndStatusOrderByCreatedAtDesc(managerId, "PENDING_MANAGER");
    }

    public List<LeaveRequest> getPendingForChairman(Integer chairmanId) {
        if (isAdmin()) {
            return leaveRequestRepository.findByStatus("PENDING_CHAIRMAN");
        }
        return leaveRequestRepository.findByChairmanIdAndStatusOrderByCreatedAtDesc(chairmanId, "PENDING_CHAIRMAN");
    }

    public LeaveRequest updateStatus(Integer id, String status) {
        return leaveRequestRepository.findById(id).map(req -> {
            req.setStatus(status);
            if ("APPROVED".equalsIgnoreCase(status)) {
                req.setManagerApprovalStatus("APPROVED");
                req.setChairmanApprovalStatus("APPROVED");
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                req.setManagerApprovalStatus("REJECTED");
                req.setChairmanApprovalStatus("REJECTED");
            }
            return leaveRequestRepository.save(req);
        }).orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
    }

    private boolean isAdmin() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ADMIN") || a.getAuthority().equals("SUPER_ADMIN"));
    }

    // Calculate dynamic leave balance based on tenure
    public LeaveBalance calculateAndGetBalance(Integer employeeId, int year) {
        Employee emp = employeeRepository.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year)
                .orElse(new LeaveBalance());

        boolean isNew = balance.getId() == null;
        if (isNew) {
            balance.setEmployee(emp);
            balance.setYear(year);
            balance.setUsedAnnualLeave(0);
            balance.setUsedSickLeave(0);
            balance.setUsedSpecialLeave(0);
            
            // Carry-over logic: Fetch previous year's balance
            leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year - 1).ifPresent(prev -> {
                double unused = (prev.getTotalAnnualLeave() + prev.getCarriedOverAnnualLeave()) - prev.getUsedAnnualLeave();
                if (unused > 0) {
                    balance.setCarriedOverAnnualLeave(unused);
                }
            });
        }

        // Logic: 18 days base + 1 AL per 3 years
        double baseAL = 18.0;
        if (emp.getJoinDate() != null) {
            long yearsWorked = ChronoUnit.YEARS.between(emp.getJoinDate(), LocalDate.now());
            double extraDays = Math.floor(yearsWorked / 3.0);
            baseAL += extraDays;
        }
        balance.setTotalAnnualLeave(baseAL);
        balance.setTotalSickLeave(7.0);
        balance.setTotalSpecialLeave(7.0);

        return leaveBalanceRepository.save(balance);
    }

    public LeaveRequest submitRequest(LeaveRequest req, Integer employeeId) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        
        req.setEmployee(emp);
        req.setStatus("PENDING_MANAGER");
        req.setManagerApprovalStatus("PENDING");
        req.setChairmanApprovalStatus("PENDING");
        req.setCreatedAt(LocalDateTime.now());
        
        return leaveRequestRepository.save(req);
    }

    public LeaveRequest approveByManager(Integer requestId, Integer managerId, boolean approved, String comment) {
        LeaveRequest req = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (approved) {
            req.setManagerApprovalStatus("APPROVED");
            req.setStatus("PENDING_CHAIRMAN");
            req.setApprovedByManagerId(managerId);
        } else {
            req.setManagerApprovalStatus("REJECTED");
            req.setStatus("REJECTED");
            req.setAdminComment(comment);
        }
        return leaveRequestRepository.save(req);
    }

    public LeaveRequest approveByChairman(Integer requestId, Integer chairmanId, boolean approved, String comment) {
        LeaveRequest req = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (approved) {
            req.setChairmanApprovalStatus("APPROVED");
            req.setStatus("APPROVED");
            req.setApprovedByHrId(chairmanId);
            // Deduct balance
            deductBalance(req);
        } else {
            req.setChairmanApprovalStatus("REJECTED");
            req.setStatus("REJECTED");
            req.setAdminComment(comment);
        }
        return leaveRequestRepository.save(req);
    }

    public double calculateDurationDays(LeaveRequest req) {
        double durationDays = "HALF_MORNING".equals(req.getDuration()) || "HALF_AFTERNOON".equals(req.getDuration()) ? 0.5 : 1.0;
        
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
        return durationDays;
    }

    private void deductBalance(LeaveRequest req) {
        int year = req.getStartDate().getYear();
        LeaveBalance balance = calculateAndGetBalance(req.getEmployee().getId(), year);

        double durationDays = calculateDurationDays(req);

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
