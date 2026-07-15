package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.UpdatePatientCommand;
import com.mtp.clinic.cqrs.dto.PatientQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PatientMapper;
import com.mtp.clinic.repositories.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdatePatientCommandHandler {

    private final PatientRepository repository;
    private final PatientMapper mapper;

    @Transactional
    public Optional<PatientQueryResultDto> handle(UpdatePatientCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setFirstName(command.getFirstName());
            entity.setLastName(command.getLastName());
            entity.setDateOfBirth(command.getDateOfBirth());
            entity.setGender(command.getGender());
            entity.setContactNumber(command.getContactNumber());
            entity.setMedicalRecordNumber(command.getMedicalRecordNumber());
            entity.setBloodType(command.getBloodType());
            entity.setAddress(mapper.toAddress(command.getAddress()));
            entity.setIsActive(command.getIsActive());
            entity.setPoorId(command.getPoorId());
            return mapper.toDto(repository.save(entity));
        });
    }
}
