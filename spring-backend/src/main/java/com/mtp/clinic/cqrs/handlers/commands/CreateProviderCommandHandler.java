package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.CreateProviderCommand;
import com.mtp.clinic.cqrs.dto.ProviderQueryResultDto;
import com.mtp.clinic.cqrs.mappers.ProviderMapper;
import com.mtp.clinic.models.Provider;
import com.mtp.clinic.repositories.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateProviderCommandHandler {

    private final ProviderRepository repository;
    private final ProviderMapper mapper;

    @Transactional
    public ProviderQueryResultDto handle(CreateProviderCommand command) {
        Provider entity = mapper.toEntity(command);
        if (entity.getId() == null) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        if (entity.getEmployeeId() == null || entity.getEmployeeId().trim().isEmpty()) {
            entity.setEmployeeId("EMP-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        Provider savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
