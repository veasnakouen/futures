package com.mtp.school.repositories;

import com.mtp.school.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentRepository extends JpaRepository<Student, String> {
    Page<Student> findByOutreachWorkerNameContainingIgnoreCase(String name, Pageable pageable);
}
