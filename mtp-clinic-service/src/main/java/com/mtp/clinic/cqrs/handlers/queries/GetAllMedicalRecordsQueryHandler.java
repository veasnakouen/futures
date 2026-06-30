package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.MedicalRecordQueryResultDto;
import com.mtp.clinic.cqrs.mappers.MedicalRecordMapper;
import com.mtp.clinic.cqrs.queries.GetAllMedicalRecordsQuery;
import com.mtp.clinic.repositories.MedicalRecordRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllMedicalRecordsQueryHandler {

    private final MedicalRecordRepository repository;
    private final MedicalRecordMapper mapper;

    public Page<MedicalRecordQueryResultDto> handle(GetAllMedicalRecordsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
