package com.mtp.school.repositories;

import com.mtp.school.models.CourseSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, String> {
    List<CourseSchedule> findByCourseId(String courseId);
    List<CourseSchedule> findByClassroomId(String classroomId);
}
