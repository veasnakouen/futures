package com.mtp.api.repositories;

import com.mtp.api.models.EmployeeEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeEnrollmentRepository extends JpaRepository<EmployeeEnrollment, Integer> {
    List<EmployeeEnrollment> findByEmployeeId(Integer employeeId);
    Optional<EmployeeEnrollment> findByEmployeeIdAndCourseId(Integer employeeId, Integer courseId);
}
