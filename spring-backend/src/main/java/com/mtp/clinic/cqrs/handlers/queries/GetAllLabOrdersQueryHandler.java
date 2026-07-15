package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.LabOrderQueryResultDto;
import com.mtp.clinic.cqrs.mappers.LabOrderMapper;
import com.mtp.clinic.cqrs.queries.GetAllLabOrdersQuery;
import com.mtp.clinic.repositories.LabOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllLabOrdersQueryHandler {

    private final LabOrderRepository repository;
    private final LabOrderMapper mapper;

    public Page<LabOrderQueryResultDto> handle(GetAllLabOrdersQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
