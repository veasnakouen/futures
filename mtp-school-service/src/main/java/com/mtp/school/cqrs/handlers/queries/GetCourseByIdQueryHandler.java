package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.CourseQueryResultDto;
import com.mtp.school.cqrs.mappers.CourseMapper;
import com.mtp.school.cqrs.queries.GetCourseByIdQuery;
import com.mtp.school.repositories.CourseRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetCourseByIdQueryHandler {

    private final CourseRepository repository;
    private final CourseMapper mapper;

    public Optional<CourseQueryResultDto> handle(GetCourseByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
