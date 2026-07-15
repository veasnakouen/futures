package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.ProviderQueryResultDto;
import com.mtp.clinic.cqrs.mappers.ProviderMapper;
import com.mtp.clinic.cqrs.queries.GetDoctorByIdQuery;
import com.mtp.clinic.repositories.ProviderRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetProviderByIdQueryHandler {

    private final ProviderRepository repository;
    private final ProviderMapper mapper;

    public Optional<ProviderQueryResultDto> handle(GetDoctorByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
