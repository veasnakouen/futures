package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.UpdateLabOrderCommand;
import com.mtp.clinic.cqrs.dto.LabOrderQueryResultDto;
import com.mtp.clinic.cqrs.mappers.LabOrderMapper;
import com.mtp.clinic.repositories.LabOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateLabOrderCommandHandler {

    private final LabOrderRepository repository;
    private final LabOrderMapper mapper;

    @Transactional
    public Optional<LabOrderQueryResultDto> handle(UpdateLabOrderCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setTestName(command.getTestName());
            entity.setLoincCode(command.getLoincCode());
            entity.setStatus(command.getStatus());
            entity.setResultValue(command.getResultValue());
            entity.setReferenceRange(command.getReferenceRange());
            entity.setAbnormalFlag(command.getAbnormalFlag());
            return mapper.toDto(repository.save(entity));
        });
    }
}
