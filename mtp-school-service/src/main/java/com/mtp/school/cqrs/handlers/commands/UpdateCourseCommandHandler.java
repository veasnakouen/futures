package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.UpdateCourseCommand;
import com.mtp.school.cqrs.dto.CourseQueryResultDto;
import com.mtp.school.cqrs.mappers.CourseMapper;
import com.mtp.school.repositories.CourseRepository;
import com.mtp.school.repositories.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateCourseCommandHandler {

    private final CourseRepository repository;
    private final TeacherRepository teacherRepository;
    private final CourseMapper mapper;

    @Transactional
    public Optional<CourseQueryResultDto> handle(UpdateCourseCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setName(command.getName());
            entity.setDescription(command.getDescription());
            entity.setCredits(command.getCredits());
            entity.setImageUrl(command.getImageUrl());
            if (command.getTeacherId() != null && !command.getTeacherId().isEmpty()) {
                teacherRepository.findById(command.getTeacherId()).ifPresent(entity::setTeacher);
            } else {
                entity.setTeacher(null);
            }
            return mapper.toDto(repository.save(entity));
        });
    }
}
