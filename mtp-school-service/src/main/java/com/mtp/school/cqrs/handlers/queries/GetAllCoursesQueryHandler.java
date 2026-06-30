package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.CourseQueryResultDto;
import com.mtp.school.cqrs.mappers.CourseMapper;
import com.mtp.school.cqrs.queries.GetAllCoursesQuery;
import com.mtp.school.repositories.CourseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllCoursesQueryHandler {

    private final CourseRepository repository;
    private final CourseMapper mapper;

    public Page<CourseQueryResultDto> handle(GetAllCoursesQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}
