package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.EnrollmentQueryResultDto;
import com.mtp.school.cqrs.mappers.EnrollmentMapper;
import com.mtp.school.cqrs.queries.GetAllEnrollmentsQuery;
import com.mtp.school.repositories.EnrollmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllEnrollmentsQueryHandler {

    private final EnrollmentRepository repository;
    private final EnrollmentMapper mapper;

    public Page<EnrollmentQueryResultDto> handle(GetAllEnrollmentsQuery query) {
        if (query.getCourseId() != null && !query.getCourseId().isEmpty()) {
            return repository.findByCourseId(query.getCourseId(), PageRequest.of(query.getPage(), query.getSize()))
                    .map(mapper::toDto);
        }
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
