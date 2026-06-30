package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.ParentQueryResultDto;
import com.mtp.school.cqrs.mappers.ParentMapper;
import com.mtp.school.cqrs.queries.GetAllParentsQuery;
import com.mtp.school.repositories.ParentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllParentsQueryHandler {

    private final ParentRepository repository;
    private final ParentMapper mapper;

    public Page<ParentQueryResultDto> handle(GetAllParentsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
