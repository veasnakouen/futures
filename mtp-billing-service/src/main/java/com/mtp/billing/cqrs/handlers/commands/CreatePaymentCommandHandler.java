package com.mtp.billing.cqrs.handlers.commands;

import com.mtp.billing.cqrs.commands.CreatePaymentCommand;
import com.mtp.billing.cqrs.dto.PaymentQueryResultDto;
import com.mtp.billing.cqrs.mappers.PaymentMapper;
import com.mtp.billing.models.Payment;
import com.mtp.billing.repositories.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreatePaymentCommandHandler {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;

    @Transactional
    public PaymentQueryResultDto handle(CreatePaymentCommand command) {
        Payment entity = mapper.toEntity(command);
        Payment savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}
