package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.commands.CreateEnrollmentCommand;
import com.mtp.school.cqrs.dto.EnrollmentQueryResultDto;
import com.mtp.school.models.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EnrollmentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "student", ignore = true)
    @Mapping(target = "course", ignore = true)
    Enrollment toEntity(CreateEnrollmentCommand command);

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "course.id", target = "courseId")
    @Mapping(target = "studentName", expression = "java(entity.getStudent() != null ? entity.getStudent().getFirstName() + \" \" + entity.getStudent().getLastName() : null)")
    @Mapping(source = "course.name", target = "courseName")
    EnrollmentQueryResultDto toDto(Enrollment entity);
}
