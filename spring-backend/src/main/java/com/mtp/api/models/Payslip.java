package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "Payslips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payslip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_record_id")
    @JsonBackReference
    private PayrollRecord payrollRecord;

    private Double basicSalary;
    private Double allowances;
    private Double grossPay;
    
    private Double unpaidLeaveDeduction;
    private Double otherDeductions;
    
    private Double taxableIncome;
    private Double taxDeducted;
    
    private Double netPay;

    private String currency = "USD"; // Default to USD
    private Double exchangeRate = 4000.0; // Assume 1 USD = 4000 KHR for local tax calculation if needed
}
