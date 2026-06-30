package com.mtp.school.repositories;

import com.mtp.school.models.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {
}
