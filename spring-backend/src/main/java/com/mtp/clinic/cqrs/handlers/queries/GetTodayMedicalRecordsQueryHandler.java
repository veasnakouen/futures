package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.MedicalRecordQueryResultDto;
import com.mtp.clinic.cqrs.mappers.MedicalRecordMapper;
import com.mtp.clinic.cqrs.queries.GetTodayMedicalRecordsQuery;
import com.mtp.clinic.repositories.MedicalRecordRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GetTodayMedicalRecordsQueryHandler {

    private final MedicalRecordRepository repository;
    private final MedicalRecordMapper mapper;

    public Page<MedicalRecordQueryResultDto> handle(GetTodayMedicalRecordsQuery query) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59, 999999999);
        return repository.findByRecordDateBetween(startOfDay, endOfDay, PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
