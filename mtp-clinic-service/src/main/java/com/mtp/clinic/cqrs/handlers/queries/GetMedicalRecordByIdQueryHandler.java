package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.MedicalRecordQueryResultDto;
import com.mtp.clinic.cqrs.mappers.MedicalRecordMapper;
import com.mtp.clinic.cqrs.queries.GetMedicalRecordByIdQuery;
import com.mtp.clinic.repositories.MedicalRecordRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetMedicalRecordByIdQueryHandler {

    private final MedicalRecordRepository repository;
    private final MedicalRecordMapper mapper;

    public Optional<MedicalRecordQueryResultDto> handle(GetMedicalRecordByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
