package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.CreateEnrollmentCommand;
import com.mtp.school.cqrs.dto.EnrollmentQueryResultDto;
import com.mtp.school.cqrs.mappers.EnrollmentMapper;
import com.mtp.school.models.Enrollment;
import com.mtp.school.repositories.EnrollmentRepository;
import com.mtp.school.repositories.StudentRepository;
import com.mtp.school.repositories.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateEnrollmentCommandHandler {

    private final EnrollmentRepository repository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentMapper mapper;

    @Transactional
    public EnrollmentQueryResultDto handle(CreateEnrollmentCommand command) {
        Enrollment entity = mapper.toEntity(command);
        
        entity.setStudent(studentRepository.findById(command.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found")));
        
        entity.setCourse(courseRepository.findById(command.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found")));
        
        Enrollment savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
