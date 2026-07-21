package com.mtp.api.services;

import com.mtp.api.models.Employee;
import com.mtp.api.models.LeaveBalance;
import com.mtp.api.models.LeaveRequest;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.LeaveBalanceRepository;
import com.mtp.api.repositories.LeaveRequestRepository;
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
        
        if (emp.getManager() != null && !emp.getManager().trim().isEmpty()) {
            employeeRepository.findByFullNameIgnoreCase(emp.getManager().trim())
                .stream().findFirst()
                .ifPresent(managerEmp -> req.setManagerId(managerEmp.getId()));
        }
        
        employeeRepository.findAll().stream()
            .filter(e -> e.getTitle() != null && e.getTitle().equalsIgnoreCase("Chairman"))
            .findFirst()
            .ifPresent(chairmanEmp -> req.setChairmanId(chairmanEmp.getId()));
            
        if (req.getStartDate() != null) {
            int year = req.getStartDate().getYear();
            LeaveBalance balance = calculateAndGetBalance(employeeId, year);
            double durationDays = calculateDurationDays(req);
            
            if ("Annual".equalsIgnoreCase(req.getLeaveType())) {
                double remaining = (balance.getTotalAnnualLeave() + balance.getCarriedOverAnnualLeave()) - balance.getUsedAnnualLeave();
                if (durationDays > remaining) {
                    String warning = " [URGENT: Exceeds AL balance by " + (durationDays - remaining) + " days]";
                    req.setReason(req.getReason() != null ? req.getReason() + warning : warning);
                } else {
                    // Check Monthly AL Plan
                    int month = req.getStartDate().getMonthValue();
                    annualLeavePlanRepository.findByEmployeeIdAndPlanYear(employeeId, year).ifPresent(plan -> {
                        double plannedDays = 0;
                        switch (month) {
                            case 1: plannedDays = plan.getJanDays(); break;
                            case 2: plannedDays = plan.getFebDays(); break;
                            case 3: plannedDays = plan.getMarDays(); break;
                            case 4: plannedDays = plan.getAprDays(); break;
                            case 5: plannedDays = plan.getMayDays(); break;
                            case 6: plannedDays = plan.getJunDays(); break;
                            case 7: plannedDays = plan.getJulDays(); break;
                            case 8: plannedDays = plan.getAugDays(); break;
                            case 9: plannedDays = plan.getSepDays(); break;
                            case 10: plannedDays = plan.getOctDays(); break;
                            case 11: plannedDays = plan.getNovDays(); break;
                            case 12: plannedDays = plan.getDecDays(); break;
                        }

                        // Calculate how many AL days have been requested/approved this month already
                        java.time.LocalDateTime monthStart = java.time.LocalDate.of(year, month, 1).atStartOfDay();
                        java.time.LocalDateTime monthEnd = monthStart.plusMonths(1).minusNanos(1);
                        
                        List<LeaveRequest> monthlyLeaves = leaveRequestRepository.findAll().stream()
                            .filter(l -> l.getEmployee().getId().equals(employeeId) && 
                                       "Annual".equalsIgnoreCase(l.getLeaveType()) &&
                                       !"REJECTED".equals(l.getStatus()) &&
                                       l.getStartDate() != null && 
                                       !l.getStartDate().isBefore(monthStart) && 
                                       !l.getStartDate().isAfter(monthEnd))
                            .toList();
                        
                        double takenThisMonth = monthlyLeaves.stream().mapToDouble(this::calculateDurationDays).sum();
                        
                        if ((takenThisMonth + durationDays) > plannedDays) {
                            String monthlyWarning = " [URGENT: Exceeds Monthly AL Plan (" + plannedDays + " days) by " + ((takenThisMonth + durationDays) - plannedDays) + " days]";
                            req.setReason(req.getReason() != null ? req.getReason() + monthlyWarning : monthlyWarning);
                        }
                    });
                }
            } else if ("Sick".equalsIgnoreCase(req.getLeaveType())) {
                double remaining = balance.getTotalSickLeave() - balance.getUsedSickLeave();
                if (durationDays > remaining) {
                    String warning = " [URGENT: Exceeds Sick Leave balance by " + (durationDays - remaining) + " days]";
                    req.setReason(req.getReason() != null ? req.getReason() + warning : warning);
                }
            }
        }
        
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
