package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.commands.CreateStudentCommand;
import com.mtp.school.cqrs.dto.StudentQueryResultDto;
import com.mtp.school.models.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = { StudentParentMapper.class,
        ExtracurricularMapper.class })
public interface StudentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "studentParents", ignore = true)
    @Mapping(target = "extracurriculars", ignore = true)
    @Mapping(target = "medicalRecord", ignore = true)
    Student toEntity(CreateStudentCommand command);

    @Mapping(source = "studentParents", target = "parents")
    StudentQueryResultDto toDto(Student entity);

    com.mtp.school.models.Address toAddress(com.mtp.school.cqrs.dto.AddressDto addressDto);
}
