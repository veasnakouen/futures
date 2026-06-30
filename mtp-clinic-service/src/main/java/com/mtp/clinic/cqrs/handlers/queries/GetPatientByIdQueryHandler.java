package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.PatientQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PatientMapper;
import com.mtp.clinic.cqrs.queries.GetPatientByIdQuery;
import com.mtp.clinic.repositories.PatientRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetPatientByIdQueryHandler {

    private final PatientRepository repository;
    private final PatientMapper mapper;

    public Optional<PatientQueryResultDto> handle(GetPatientByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
