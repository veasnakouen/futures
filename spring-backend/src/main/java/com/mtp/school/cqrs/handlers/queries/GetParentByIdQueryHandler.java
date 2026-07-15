package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.ParentQueryResultDto;
import com.mtp.school.cqrs.mappers.ParentMapper;
import com.mtp.school.cqrs.queries.GetParentByIdQuery;
import com.mtp.school.repositories.ParentRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetParentByIdQueryHandler {

    private final ParentRepository repository;
    private final ParentMapper mapper;

    public Optional<ParentQueryResultDto> handle(GetParentByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
