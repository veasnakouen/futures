package com.mtp.billing.cqrs.handlers.queries;

import com.mtp.billing.cqrs.dto.InvoiceQueryResultDto;
import com.mtp.billing.cqrs.mappers.InvoiceMapper;
import com.mtp.billing.cqrs.queries.GetAllInvoicesQuery;
import com.mtp.billing.repositories.InvoiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllInvoicesQueryHandler {

    private final InvoiceRepository repository;
    private final InvoiceMapper mapper;

    public Page<InvoiceQueryResultDto> handle(GetAllInvoicesQuery query) {
        org.springframework.data.domain.Pageable pageable = query.getPageable() != null ? query.getPageable()
                : PageRequest.of(query.getPage(), query.getSize());
        return repository.findAll(pageable)
                .map(mapper::toDto);
    }
}
