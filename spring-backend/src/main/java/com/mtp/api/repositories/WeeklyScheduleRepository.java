package com.mtp.api.repositories;

import com.mtp.api.models.WeeklySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeeklyScheduleRepository extends JpaRepository<WeeklySchedule, Integer> {
    Optional<WeeklySchedule> findByEmployeeIdNo(String idNo);
    Optional<WeeklySchedule> findByEmployeeId(Integer employeeId);
    List<WeeklySchedule> findByEmployeeDepartmentId(Integer departmentId);
}
