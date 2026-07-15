package com.mtp.attendance.repositories;

import com.mtp.attendance.models.AttendanceConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttendanceConfigRepository extends JpaRepository<AttendanceConfig, Long> {
    Optional<AttendanceConfig> findByDepartmentId(Long departmentId);
}
