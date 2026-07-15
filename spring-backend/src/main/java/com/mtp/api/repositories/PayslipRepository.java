package com.mtp.api.repositories;

import com.mtp.api.models.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayslipRepository extends JpaRepository<Payslip, Integer> {
    List<Payslip> findByPayrollRecordId(Integer payrollRecordId);
    List<Payslip> findByEmployeeId(Integer employeeId);
}
