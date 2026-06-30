package com.mtp.billing.cqrs.handlers.commands;

import com.mtp.billing.cqrs.commands.UpdatePaymentCommand;
import com.mtp.billing.cqrs.dto.PaymentQueryResultDto;
import com.mtp.billing.cqrs.mappers.PaymentMapper;
import com.mtp.billing.repositories.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdatePaymentCommandHandler {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;

    @Transactional
    public Optional<PaymentQueryResultDto> handle(UpdatePaymentCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setAmount(command.getAmount());
            entity.setSubmitDate(command.getSubmitDate());
            entity.setStatus(command.getStatus());
            entity.setAdjudicatedAmount(command.getAdjudicatedAmount());
            entity.setReferenceId(command.getReferenceId());
            entity.setSourceModule(command.getSourceModule());
            return mapper.toDto(repository.save(entity));
        });
    }
}
