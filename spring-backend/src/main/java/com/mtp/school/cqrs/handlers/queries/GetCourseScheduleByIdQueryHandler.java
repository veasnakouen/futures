package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.CourseScheduleQueryResultDto;
import com.mtp.school.cqrs.mappers.CourseScheduleMapper;
import com.mtp.school.cqrs.queries.GetCourseScheduleByIdQuery;
import com.mtp.school.repositories.CourseScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetCourseScheduleByIdQueryHandler {
    private final CourseScheduleRepository repository;
    private final CourseScheduleMapper mapper;

    public Optional<CourseScheduleQueryResultDto> handle(GetCourseScheduleByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}
