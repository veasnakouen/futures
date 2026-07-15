package com.mtp.api.controllers;

import com.mtp.api.models.Employee;
import com.mtp.api.models.PayrollRecord;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.PayrollRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/hr/payroll")
public class PayrollController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PayrollRecordRepository payrollRecordRepository;

    @Autowired
    private com.mtp.api.repositories.LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private com.mtp.api.repositories.PayslipRepository payslipRepository;

    @GetMapping
    public List<PayrollRecord> getAll() {
        return payrollRecordRepository.findAll();
    }

    @PostMapping("/process")
    public ResponseEntity<?> processPayroll() {
        List<Employee> employees = employeeRepository.findAll();
        
        double totalGross = 0.0;
        double totalTax = 0.0;
        double totalNet = 0.0;
        int count = 0;

        for (Employee e : employees) {
            if ("Active".equalsIgnoreCase(e.getStatus()) && e.getBasicSalary() != null) {
                double basic = e.getBasicSalary();
                double allowance = e.getAllowances() != null ? e.getAllowances() : 0.0;
                double deduction = e.getDeductions() != null ? e.getDeductions() : 0.0;
                double rate = e.getTaxRate() != null ? e.getTaxRate() : 0.0;
                
                // Calculate Unpaid Leave deductions
                List<com.mtp.api.models.LeaveRequest> leaves = leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(e.getId());
                double unpaidLeaveDeduction = 0.0;
                for (com.mtp.api.models.LeaveRequest req : leaves) {
                    if ("APPROVED".equals(req.getStatus()) && "Unpaid".equalsIgnoreCase(req.getLeaveType())) {
                        double days = 1.0;
                        if ("HALF_MORNING".equals(req.getDuration()) || "HALF_AFTERNOON".equals(req.getDuration())) {
                            days = 0.5;
                        } else if ("FULL_DAY".equals(req.getDuration()) && req.getEndDate() != null && req.getStartDate() != null) {
                            days = java.time.temporal.ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate()) + 1;
                        }
                        unpaidLeaveDeduction += (basic / 30.0) * days;
                    }
                }
                deduction += unpaidLeaveDeduction;

                double gross = basic + allowance;
                double taxableIncome = Math.max(0, gross - deduction);
                double tax = taxableIncome * rate;
                double net = gross - tax - deduction;

                totalGross += gross;
                totalTax += tax;
                totalNet += net;
                count++;
            }
        }

        PayrollRecord record = new PayrollRecord();
        record.setProcessedDate(LocalDateTime.now());
        record.setTotalEmployeesProcessed(count);
        record.setTotalAmount(totalNet); // legacy compatibility
        record.setTotalGrossAmount(totalGross);
        record.setTotalTaxDeducted(totalTax);
        record.setTotalNetPayable(totalNet);
        record.setStatus("Completed");

        PayrollRecord savedRecord = payrollRecordRepository.save(record);

        // Generate individual payslips
        for (Employee e : employees) {
            if ("Active".equalsIgnoreCase(e.getStatus()) && e.getBasicSalary() != null) {
                double basic = e.getBasicSalary();
                double allowance = e.getAllowances() != null ? e.getAllowances() : 0.0;
                double rate = e.getTaxRate() != null ? e.getTaxRate() : 0.0;
                double otherDeductions = e.getDeductions() != null ? e.getDeductions() : 0.0;
                
                double unpaidLeaveDeduction = 0.0;
                List<com.mtp.api.models.LeaveRequest> leaves = leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(e.getId());
                for (com.mtp.api.models.LeaveRequest req : leaves) {
                    if ("APPROVED".equals(req.getStatus()) && "Unpaid".equalsIgnoreCase(req.getLeaveType())) {
                        double days = 1.0;
                        if ("HALF_MORNING".equals(req.getDuration()) || "HALF_AFTERNOON".equals(req.getDuration())) {
                            days = 0.5;
                        } else if ("FULL_DAY".equals(req.getDuration()) && req.getEndDate() != null && req.getStartDate() != null) {
                            days = java.time.temporal.ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate()) + 1;
                        }
                        unpaidLeaveDeduction += (basic / 30.0) * days;
                    }
                }

                double gross = basic + allowance;
                double taxableIncome = Math.max(0, gross - otherDeductions - unpaidLeaveDeduction);
                double tax = taxableIncome * rate;
                double net = gross - tax - otherDeductions - unpaidLeaveDeduction;

                com.mtp.api.models.Payslip payslip = new com.mtp.api.models.Payslip();
                payslip.setEmployee(e);
                payslip.setPayrollRecord(savedRecord);
                payslip.setBasicSalary(basic);
                payslip.setAllowances(allowance);
                payslip.setGrossPay(gross);
                payslip.setUnpaidLeaveDeduction(unpaidLeaveDeduction);
                payslip.setOtherDeductions(otherDeductions);
                payslip.setTaxableIncome(taxableIncome);
                payslip.setTaxDeducted(tax);
                payslip.setNetPay(net);
                payslip.setCurrency("USD");
                
                payslipRepository.save(payslip);
            }
        }

        return ResponseEntity.ok(savedRecord);
    }
}
