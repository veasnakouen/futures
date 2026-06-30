package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.CourseScheduleQueryResultDto;
import com.mtp.school.cqrs.mappers.CourseScheduleMapper;
import com.mtp.school.cqrs.queries.GetAllCourseSchedulesQuery;
import com.mtp.school.repositories.CourseScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllCourseSchedulesQueryHandler {
    private final CourseScheduleRepository repository;
    private final CourseScheduleMapper mapper;

    public List<CourseScheduleQueryResultDto> handle(GetAllCourseSchedulesQuery query) {
        return mapper.toDtoList(repository.findAll());
    }
}
