package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.CreateTeacherCommand;
import com.mtp.school.cqrs.dto.TeacherQueryResultDto;
import com.mtp.school.cqrs.mappers.TeacherMapper;
import com.mtp.school.models.Teacher;
import com.mtp.school.repositories.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateTeacherCommandHandler {

    private final TeacherRepository repository;
    private final TeacherMapper mapper;

    @Transactional
    public TeacherQueryResultDto handle(CreateTeacherCommand command) {
        Teacher entity = mapper.toEntity(command);
        Teacher savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
