package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.ExtracurricularQueryResultDto;
import com.mtp.school.cqrs.mappers.ExtracurricularMapper;
import com.mtp.school.cqrs.queries.GetAllExtracurricularsQuery;
import com.mtp.school.repositories.ExtracurricularRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllExtracurricularsQueryHandler {

    private final ExtracurricularRepository repository;
    private final ExtracurricularMapper mapper;

    public Page<ExtracurricularQueryResultDto> handle(GetAllExtracurricularsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
