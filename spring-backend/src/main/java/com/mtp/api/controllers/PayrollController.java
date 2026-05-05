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

    @PostMapping("/process")
    public ResponseEntity<?> processPayroll() {
        List<Employee> employees = employeeRepository.findAll();
        
        double totalAmount = 0;
        int count = 0;

        for (Employee e : employees) {
            if ("Active".equalsIgnoreCase(e.getStatus()) && e.getBasicSalary() != null) {
                totalAmount += e.getBasicSalary();
                count++;
            }
        }

        PayrollRecord record = new PayrollRecord();
        record.setProcessedDate(LocalDateTime.now());
        record.setTotalEmployeesProcessed(count);
        record.setTotalAmount(totalAmount);
        record.setStatus("Completed");

        return ResponseEntity.ok(payrollRecordRepository.save(record));
    }
}
