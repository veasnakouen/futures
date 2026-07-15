package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.LabOrderQueryResultDto;
import com.mtp.clinic.cqrs.mappers.LabOrderMapper;
import com.mtp.clinic.cqrs.queries.GetLabOrderByIdQuery;
import com.mtp.clinic.repositories.LabOrderRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetLabOrderByIdQueryHandler {

    private final LabOrderRepository repository;
    private final LabOrderMapper mapper;

    public Optional<LabOrderQueryResultDto> handle(GetLabOrderByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
