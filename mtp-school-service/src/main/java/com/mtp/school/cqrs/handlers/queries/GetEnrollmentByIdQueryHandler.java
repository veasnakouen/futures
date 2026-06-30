package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.EnrollmentQueryResultDto;
import com.mtp.school.cqrs.mappers.EnrollmentMapper;
import com.mtp.school.cqrs.queries.GetEnrollmentByIdQuery;
import com.mtp.school.repositories.EnrollmentRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetEnrollmentByIdQueryHandler {

    private final EnrollmentRepository repository;
    private final EnrollmentMapper mapper;

    public Optional<EnrollmentQueryResultDto> handle(GetEnrollmentByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
