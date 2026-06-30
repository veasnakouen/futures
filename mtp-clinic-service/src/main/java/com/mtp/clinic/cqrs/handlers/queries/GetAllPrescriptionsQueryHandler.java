package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.PrescriptionQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PrescriptionMapper;
import com.mtp.clinic.cqrs.queries.GetAllPrescriptionsQuery;
import com.mtp.clinic.repositories.PrescriptionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllPrescriptionsQueryHandler {

    private final PrescriptionRepository repository;
    private final PrescriptionMapper mapper;

    public Page<PrescriptionQueryResultDto> handle(GetAllPrescriptionsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
