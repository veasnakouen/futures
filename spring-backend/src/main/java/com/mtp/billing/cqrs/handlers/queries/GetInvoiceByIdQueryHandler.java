package com.mtp.billing.cqrs.handlers.queries;

import com.mtp.billing.cqrs.dto.InvoiceQueryResultDto;
import com.mtp.billing.cqrs.mappers.InvoiceMapper;
import com.mtp.billing.cqrs.queries.GetInvoiceByIdQuery;
import com.mtp.billing.repositories.InvoiceRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetInvoiceByIdQueryHandler {

    private final InvoiceRepository repository;
    private final InvoiceMapper mapper;

    public Optional<InvoiceQueryResultDto> handle(GetInvoiceByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
