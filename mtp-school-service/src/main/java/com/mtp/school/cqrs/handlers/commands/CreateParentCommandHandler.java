package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.CreateParentCommand;
import com.mtp.school.cqrs.dto.ParentQueryResultDto;
import com.mtp.school.cqrs.mappers.ParentMapper;
import com.mtp.school.models.Parent;
import com.mtp.school.repositories.ParentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateParentCommandHandler {

    private final ParentRepository repository;
    private final ParentMapper mapper;

    @Transactional
    public ParentQueryResultDto handle(CreateParentCommand command) {
        Parent entity = mapper.toEntity(command);
        Parent savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
