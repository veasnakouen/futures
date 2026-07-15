package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.UpdateProviderCommand;
import com.mtp.clinic.cqrs.dto.ProviderQueryResultDto;
import com.mtp.clinic.cqrs.mappers.ProviderMapper;
import com.mtp.clinic.repositories.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateProviderCommandHandler {

    private final ProviderRepository repository;
    private final ProviderMapper mapper;

    @Transactional
    public Optional<ProviderQueryResultDto> handle(UpdateProviderCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setFirstName(command.getFirstName());
            entity.setLastName(command.getLastName());
            entity.setSpecialization(command.getSpecialization());
            entity.setContactNumber(command.getContactNumber());
            entity.setEmail(command.getEmail());
            entity.setIsActive(command.getIsActive());
            return mapper.toDto(repository.save(entity));
        });
    }
}
