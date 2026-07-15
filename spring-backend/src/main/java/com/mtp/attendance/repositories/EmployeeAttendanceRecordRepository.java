package com.mtp.attendance.repositories;

import com.mtp.attendance.models.EmployeeAttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmployeeAttendanceRecordRepository extends JpaRepository<EmployeeAttendanceRecord, Long> {
    List<EmployeeAttendanceRecord> findByEmployeeIdAndScanTimeBetween(Long employeeId, LocalDateTime start, LocalDateTime end);
    List<EmployeeAttendanceRecord> findByDepartmentIdAndScanTimeBetween(Long departmentId, LocalDateTime start, LocalDateTime end);
}
