package com.mtp.api.repositories;

import com.mtp.api.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    List<Attendance> findByEmployeeId(Integer employeeId);
    Optional<Attendance> findTopByEmployeeIdAndClockOutIsNullOrderByClockInDesc(Integer employeeId);
}
