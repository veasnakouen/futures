package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.PatientQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PatientMapper;
import com.mtp.clinic.cqrs.queries.GetAllPatientsQuery;
import com.mtp.clinic.repositories.PatientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllPatientsQueryHandler {

    private final PatientRepository repository;
    private final PatientMapper mapper;

    public Page<PatientQueryResultDto> handle(GetAllPatientsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
