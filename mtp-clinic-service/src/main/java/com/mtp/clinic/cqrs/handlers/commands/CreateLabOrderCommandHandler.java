package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.CreateLabOrderCommand;
import com.mtp.clinic.cqrs.dto.LabOrderQueryResultDto;
import com.mtp.clinic.cqrs.mappers.LabOrderMapper;
import com.mtp.clinic.models.LabOrder;
import com.mtp.clinic.repositories.LabOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateLabOrderCommandHandler {

    private final LabOrderRepository repository;
    private final LabOrderMapper mapper;

    @Transactional
    public LabOrderQueryResultDto handle(CreateLabOrderCommand command) {
        LabOrder entity = mapper.toEntity(command);
        LabOrder savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
