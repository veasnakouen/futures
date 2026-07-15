package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.CreateExtracurricularCommand;
import com.mtp.school.cqrs.dto.ExtracurricularQueryResultDto;
import com.mtp.school.cqrs.mappers.ExtracurricularMapper;
import com.mtp.school.models.Extracurricular;
import com.mtp.school.repositories.ExtracurricularRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import com.mtp.school.repositories.TeacherRepository;

@Service
@RequiredArgsConstructor
public class CreateExtracurricularCommandHandler {

    private final ExtracurricularRepository repository;
    private final TeacherRepository teacherRepository;
    private final ExtracurricularMapper mapper;

    @Transactional
    public ExtracurricularQueryResultDto handle(CreateExtracurricularCommand command) {
        Extracurricular entity = mapper.toEntity(command);
        if (command.getLeadTeacherId() != null && !command.getLeadTeacherId().isEmpty()) {
            entity.setLeadTeacher(teacherRepository.findById(command.getLeadTeacherId()).orElse(null));
        }
        Extracurricular savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
