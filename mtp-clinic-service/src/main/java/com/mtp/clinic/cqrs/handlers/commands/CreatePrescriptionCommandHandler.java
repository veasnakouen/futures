package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.CreatePrescriptionCommand;
import com.mtp.clinic.cqrs.dto.PrescriptionQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PrescriptionMapper;
import com.mtp.clinic.models.Prescription;
import com.mtp.clinic.repositories.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreatePrescriptionCommandHandler {

    private final PrescriptionRepository repository;
    private final PrescriptionMapper mapper;

    @Transactional
    public PrescriptionQueryResultDto handle(CreatePrescriptionCommand command) {
        Prescription entity = mapper.toEntity(command);
        Prescription savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
