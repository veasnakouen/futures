package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.ExtracurricularQueryResultDto;
import com.mtp.school.cqrs.mappers.ExtracurricularMapper;
import com.mtp.school.cqrs.queries.GetExtracurricularByIdQuery;
import com.mtp.school.repositories.ExtracurricularRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetExtracurricularByIdQueryHandler {

    private final ExtracurricularRepository repository;
    private final ExtracurricularMapper mapper;

    public Optional<ExtracurricularQueryResultDto> handle(GetExtracurricularByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
