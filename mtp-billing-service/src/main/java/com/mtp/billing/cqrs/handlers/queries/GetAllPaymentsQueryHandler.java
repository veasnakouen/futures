package com.mtp.billing.cqrs.handlers.queries;

import com.mtp.billing.cqrs.dto.PaymentQueryResultDto;
import com.mtp.billing.cqrs.mappers.PaymentMapper;
import com.mtp.billing.cqrs.queries.GetAllPaymentsQuery;
import com.mtp.billing.repositories.PaymentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllPaymentsQueryHandler {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;

    public Page<PaymentQueryResultDto> handle(GetAllPaymentsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
