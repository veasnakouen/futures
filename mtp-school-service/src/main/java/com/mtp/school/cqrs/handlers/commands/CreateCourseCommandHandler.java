package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.CreateCourseCommand;
import com.mtp.school.cqrs.dto.CourseQueryResultDto;
import com.mtp.school.cqrs.mappers.CourseMapper;
import com.mtp.school.models.Course;
import com.mtp.school.repositories.CourseRepository;
import com.mtp.school.repositories.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateCourseCommandHandler {

    private final CourseRepository repository;
    private final TeacherRepository teacherRepository;
    private final CourseMapper mapper;

    @Transactional
    public CourseQueryResultDto handle(CreateCourseCommand command) {
        Course entity = mapper.toEntity(command);

        if (command.getTeacherId() != null && !command.getTeacherId().isEmpty()) {
            teacherRepository.findById(command.getTeacherId()).ifPresent(entity::setTeacher);
        }

        Course savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
