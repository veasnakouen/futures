package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.commands.CreateCourseCommand;
import com.mtp.school.cqrs.dto.CourseQueryResultDto;
import com.mtp.school.models.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CourseMapper {
    @Mapping(target = "id", ignore = true)
    Course toEntity(CreateCourseCommand command);

    CourseQueryResultDto toDto(Course entity);
}
