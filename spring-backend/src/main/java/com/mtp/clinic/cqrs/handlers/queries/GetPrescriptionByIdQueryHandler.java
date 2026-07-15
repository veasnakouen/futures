package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.PrescriptionQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PrescriptionMapper;
import com.mtp.clinic.cqrs.queries.GetPrescriptionByIdQuery;
import com.mtp.clinic.repositories.PrescriptionRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetPrescriptionByIdQueryHandler {

    private final PrescriptionRepository repository;
    private final PrescriptionMapper mapper;

    public Optional<PrescriptionQueryResultDto> handle(GetPrescriptionByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
