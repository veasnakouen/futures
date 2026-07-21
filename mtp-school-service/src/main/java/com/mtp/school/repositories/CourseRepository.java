package com.mtp.school.repositories;

import com.mtp.school.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourseRepository extends JpaRepository<Course, String> {
    Page<Course> findByTeacherId(String teacherId, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Course> searchAllFields(@Param("search") String search, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.teacher.id = :teacherId AND (" +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Course> searchAllFieldsByTeacherId(@Param("search") String search, @Param("teacherId") String teacherId, Pageable pageable);
}
