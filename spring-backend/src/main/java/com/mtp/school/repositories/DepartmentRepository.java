package com.mtp.school.repositories;

import com.mtp.school.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("schoolDepartmentRepository")
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
