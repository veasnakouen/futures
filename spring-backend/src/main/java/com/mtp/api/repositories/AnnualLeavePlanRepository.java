package com.mtp.api.repositories;

import com.mtp.api.models.AnnualLeavePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AnnualLeavePlanRepository extends JpaRepository<AnnualLeavePlan, Integer> {
    Optional<AnnualLeavePlan> findByEmployeeIdAndPlanYear(Integer employeeId, int planYear);
    List<AnnualLeavePlan> findByPlanYear(int planYear);
}
