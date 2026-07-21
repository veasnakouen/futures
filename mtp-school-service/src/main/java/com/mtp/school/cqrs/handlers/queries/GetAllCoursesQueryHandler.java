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
        Page<com.mtp.school.models.Course> courses;
        boolean hasSearch = query.getSearch() != null && !query.getSearch().trim().isEmpty();
        boolean hasTeacher = query.getTeacherId() != null && !query.getTeacherId().isEmpty();

        if (hasSearch && hasTeacher) {
            courses = repository.searchAllFieldsByTeacherId(query.getSearch(), query.getTeacherId(), query.getPageable());
        } else if (hasSearch) {
            courses = repository.searchAllFields(query.getSearch(), query.getPageable());
        } else if (hasTeacher) {
            courses = repository.findByTeacherId(query.getTeacherId(), query.getPageable());
        } else {
            courses = repository.findAll(query.getPageable());
        }
        
        return courses.map(mapper::toDto);
    }
}
