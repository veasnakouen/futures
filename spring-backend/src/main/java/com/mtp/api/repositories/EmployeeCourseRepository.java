package com.mtp.api.repositories;

import com.mtp.api.models.EmployeeCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmployeeCourseRepository extends JpaRepository<EmployeeCourse, Integer> {
    Optional<EmployeeCourse> findByTitle(String title);
}
