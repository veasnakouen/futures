package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.CreatePatientCommand;
import com.mtp.clinic.cqrs.dto.PatientQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PatientMapper;
import com.mtp.clinic.models.Patient;
import com.mtp.clinic.repositories.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreatePatientCommandHandler {

    private final PatientRepository repository;
    private final PatientMapper mapper;

    @Transactional
    public PatientQueryResultDto handle(CreatePatientCommand command) {
        Patient entity = mapper.toEntity(command);
        Patient savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
