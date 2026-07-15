package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "PayrollRecords")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayrollRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDateTime processedDate;

    private Integer totalEmployeesProcessed;

    private Double totalAmount; // legacy alias for gross or net? we'll keep it for compat.

    private Double totalGrossAmount;

    private Double totalTaxDeducted;

    private Double totalNetPayable;

    @jakarta.validation.constraints.Size(max = 50)
    private String status; // Pending, Processing, Completed

    @OneToMany(mappedBy = "payrollRecord", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private java.util.List<Payslip> payslips;
}
