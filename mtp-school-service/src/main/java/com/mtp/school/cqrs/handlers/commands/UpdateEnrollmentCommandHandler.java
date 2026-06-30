package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.UpdateEnrollmentCommand;
import com.mtp.school.cqrs.dto.EnrollmentQueryResultDto;
import com.mtp.school.cqrs.mappers.EnrollmentMapper;
import com.mtp.school.repositories.EnrollmentRepository;
import com.mtp.school.repositories.StudentRepository;
import com.mtp.school.repositories.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateEnrollmentCommandHandler {

    private final EnrollmentRepository repository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentMapper mapper;

    @Transactional
    public Optional<EnrollmentQueryResultDto> handle(UpdateEnrollmentCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setEnrollmentDate(command.getEnrollmentDate());
            entity.setGrade(command.getGrade());
            
            entity.setStudent(studentRepository.findById(command.getStudentId())
                    .orElseThrow(() -> new IllegalArgumentException("Student not found")));
            
            entity.setCourse(courseRepository.findById(command.getCourseId())
                    .orElseThrow(() -> new IllegalArgumentException("Course not found")));
            
            return mapper.toDto(repository.save(entity));
        });
    }
}
