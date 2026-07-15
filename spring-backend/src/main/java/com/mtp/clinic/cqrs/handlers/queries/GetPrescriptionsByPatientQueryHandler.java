package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.PrescriptionQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PrescriptionMapper;
import com.mtp.clinic.cqrs.queries.GetPrescriptionsByPatientQuery;
import com.mtp.clinic.repositories.PrescriptionRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetPrescriptionsByPatientQueryHandler {

    private final PrescriptionRepository repository;
    private final PrescriptionMapper mapper;

    public List<PrescriptionQueryResultDto> handle(GetPrescriptionsByPatientQuery query) {
        return repository.findByPatientId(query.getPatientId())
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}
