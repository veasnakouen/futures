package com.mtp.school.repositories;

import com.mtp.school.models.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
    @Query("SELECT t FROM Teacher t WHERE " +
           "LOWER(t.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Teacher> searchAllFields(@Param("search") String search, Pageable pageable);
}
