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
            if (command.getFirstName() != null) entity.setFirstName(command.getFirstName());
            if (command.getLastName() != null) entity.setLastName(command.getLastName());
            if (command.getSpecialization() != null) entity.setSpecialization(command.getSpecialization());
            if (command.getContactNumber() != null) entity.setContactNumber(command.getContactNumber());
            if (command.getEmail() != null) entity.setEmail(command.getEmail());
            if (command.getIsActive() != null) entity.setIsActive(command.getIsActive());
            if (command.getLicenseNumber() != null) entity.setLicenseNumber(command.getLicenseNumber());
            if (command.getYearOfExperience() != null) entity.setYearOfExperience(command.getYearOfExperience());
            if (command.getNpiNumber() != null) entity.setNpiNumber(command.getNpiNumber());
            if (command.getConsultationFee() != null) entity.setConsultationFee(command.getConsultationFee());
            if (command.getEmployeeId() != null) entity.setEmployeeId(command.getEmployeeId());
            if (command.getRole() != null) entity.setRole(command.getRole());
            if (command.getHiredDate() != null) entity.setHiredDate(command.getHiredDate());
            if (command.getTerminationDate() != null) entity.setTerminationDate(command.getTerminationDate());
            if (command.getShift() != null) entity.setShift(command.getShift());
            return mapper.toDto(repository.save(entity));
        });
    }
}
