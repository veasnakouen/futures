package com.mtp.api.repositories;

import com.mtp.api.models.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Integer> {
    Optional<LeaveBalance> findByEmployeeIdAndYear(Integer employeeId, int year);
}
