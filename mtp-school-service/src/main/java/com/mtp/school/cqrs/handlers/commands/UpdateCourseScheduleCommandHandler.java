package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.UpdateCourseScheduleCommand;
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
public class UpdateCourseScheduleCommandHandler {
    private final CourseScheduleRepository scheduleRepository;
    private final CourseRepository courseRepository;
    private final ClassroomRepository classroomRepository;
    private final CourseScheduleMapper mapper;

    public Optional<CourseScheduleQueryResultDto> handle(UpdateCourseScheduleCommand command) {
        Optional<CourseSchedule> existingOpt = scheduleRepository.findById(command.getId());
        if (existingOpt.isEmpty()) {
            return Optional.empty();
        }

        CourseSchedule schedule = existingOpt.get();

        if (!schedule.getCourse().getId().equals(command.getCourseId())) {
            Optional<Course> courseOpt = courseRepository.findById(command.getCourseId());
            courseOpt.ifPresent(schedule::setCourse);
        }

        if (!schedule.getClassroom().getId().equals(command.getClassroomId())) {
            Optional<Classroom> classroomOpt = classroomRepository.findById(command.getClassroomId());
            classroomOpt.ifPresent(schedule::setClassroom);
        }

        schedule.setDayOfWeek(command.getDayOfWeek());
        schedule.setStartTime(command.getStartTime());
        schedule.setEndTime(command.getEndTime());
        
        if (command.getIsActive() != null) {
            schedule.setIsActive(command.getIsActive());
        }

        CourseSchedule saved = scheduleRepository.save(schedule);
        return Optional.of(mapper.toDto(saved));
    }
}
