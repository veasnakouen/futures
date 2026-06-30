package com.mtp.billing.cqrs.handlers.queries;

import com.mtp.billing.cqrs.dto.PaymentQueryResultDto;
import com.mtp.billing.cqrs.mappers.PaymentMapper;
import com.mtp.billing.cqrs.queries.GetPaymentByIdQuery;
import com.mtp.billing.repositories.PaymentRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetPaymentByIdQueryHandler {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;

    public Optional<PaymentQueryResultDto> handle(GetPaymentByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
