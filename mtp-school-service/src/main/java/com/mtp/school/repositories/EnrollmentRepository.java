package com.mtp.school.repositories;

import com.mtp.school.models.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {
    Page<Enrollment> findByCourseId(String courseId, Pageable pageable);
}
