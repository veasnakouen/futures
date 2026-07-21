package com.mtp.api.repositories;

import com.mtp.api.models.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Integer> {
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Integer employeeId);
    List<LeaveRequest> findByManagerIdAndStatusOrderByCreatedAtDesc(Integer managerId, String status);
    List<LeaveRequest> findByChairmanIdAndStatusOrderByCreatedAtDesc(Integer chairmanId, String status);
    List<LeaveRequest> findByStatus(String status);

    @org.springframework.data.jpa.repository.Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.id = :employeeId AND lr.status = 'APPROVED' AND lr.startDate <= :weekEnd AND lr.endDate >= :weekStart")
    List<LeaveRequest> findApprovedLeavesForWeek(@org.springframework.data.repository.query.Param("employeeId") Integer employeeId, @org.springframework.data.repository.query.Param("weekStart") java.time.LocalDateTime weekStart, @org.springframework.data.repository.query.Param("weekEnd") java.time.LocalDateTime weekEnd);
}
