package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.commands.CreateCourseScheduleCommand;
import com.mtp.school.cqrs.dto.CourseScheduleQueryResultDto;
import com.mtp.school.models.CourseSchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CourseScheduleMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "classroom", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    CourseSchedule toEntity(CreateCourseScheduleCommand command);

    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "classroom.id", target = "classroomId")
    CourseScheduleQueryResultDto toDto(CourseSchedule entity);

    List<CourseScheduleQueryResultDto> toDtoList(List<CourseSchedule> entities);
}
