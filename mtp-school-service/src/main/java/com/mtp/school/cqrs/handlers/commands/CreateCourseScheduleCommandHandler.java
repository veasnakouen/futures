package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.CreateCourseScheduleCommand;
import com.mtp.school.cqrs.dto.CourseScheduleQueryResultDto;
import com.mtp.school.cqrs.mappers.CourseScheduleMapper;
import com.mtp.school.models.Classroom;
import com.mtp.school.models.Course;
import com.mtp.school.models.CourseSchedule;
import com.mtp.school.repositories.ClassroomRepository;
import com.mtp.school.repositories.CourseRepository;
import com.mtp.school.repositories.CourseScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CreateCourseScheduleCommandHandler {
    private final CourseScheduleRepository scheduleRepository;
    private final CourseRepository courseRepository;
    private final ClassroomRepository classroomRepository;
    private final CourseScheduleMapper mapper;

    public Optional<CourseScheduleQueryResultDto> handle(CreateCourseScheduleCommand command) {
        Optional<Course> courseOpt = courseRepository.findById(command.getCourseId());
        Optional<Classroom> classroomOpt = classroomRepository.findById(command.getClassroomId());

        if (courseOpt.isEmpty() || classroomOpt.isEmpty()) {
            return Optional.empty(); // Should be proper exception in real app
        }

        CourseSchedule schedule = mapper.toEntity(command);
        schedule.setCourse(courseOpt.get());
        schedule.setClassroom(classroomOpt.get());

        CourseSchedule saved = scheduleRepository.save(schedule);
        return Optional.of(mapper.toDto(saved));
    }
}
