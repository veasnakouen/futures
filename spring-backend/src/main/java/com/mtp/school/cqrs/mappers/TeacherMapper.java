package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.commands.CreateTeacherCommand;
import com.mtp.school.cqrs.dto.TeacherQueryResultDto;
import com.mtp.school.models.Teacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TeacherMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch.id", source = "branchId")
    Teacher toEntity(CreateTeacherCommand command);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch.id", source = "branchId")
    Teacher toEntity(com.mtp.school.cqrs.commands.UpdateTeacherCommand command);

    @Mapping(target = "branchId", source = "branch.id")
    TeacherQueryResultDto toDto(Teacher entity);
}
