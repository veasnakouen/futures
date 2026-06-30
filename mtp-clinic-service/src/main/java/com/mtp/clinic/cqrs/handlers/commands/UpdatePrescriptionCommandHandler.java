package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.UpdatePrescriptionCommand;
import com.mtp.clinic.cqrs.dto.PrescriptionQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PrescriptionMapper;
import com.mtp.clinic.repositories.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdatePrescriptionCommandHandler {

    private final PrescriptionRepository repository;
    private final PrescriptionMapper mapper;

    @Transactional
    public Optional<PrescriptionQueryResultDto> handle(UpdatePrescriptionCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setPatientId(command.getPatientId());
            entity.setDiagnosis(command.getDiagnosis());
            
            entity.getItems().clear();
            if (command.getItems() != null) {
                command.getItems().forEach(itemDto -> {
                    com.mtp.clinic.models.PrescriptionItem item = new com.mtp.clinic.models.PrescriptionItem();
                    item.setDrugName(itemDto.getDrugName());
                    item.setNdcCode(itemDto.getNdcCode());
                    item.setDosage(itemDto.getDosage());
                    item.setFrequency(itemDto.getFrequency());
                    item.setDuration(itemDto.getDuration());
                    item.setRefillsAllowed(itemDto.getRefillsAllowed());
                    item.setPhamacyId(itemDto.getPhamacyId());
                    item.setPrescription(entity);
                    entity.getItems().add(item);
                });
            }
            return mapper.toDto(repository.save(entity));
        });
    }
}
