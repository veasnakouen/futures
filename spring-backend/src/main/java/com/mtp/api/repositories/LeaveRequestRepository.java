package com.mtp.api.repositories;

import com.mtp.api.models.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Integer> {
    List<LeaveRequest> findByEmployeeId(Integer employeeId);
    List<LeaveRequest> findByStatus(String status);
}
