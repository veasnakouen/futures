package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.dto.StudentParentDto;
import com.mtp.school.models.StudentParent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {ParentMapper.class}
)
public interface StudentParentMapper {
    @Mapping(source = "parent.id", target = "id")
    @Mapping(target = "name", expression = "java(entity.getParent().getFirstName() + \" \" + entity.getParent().getLastName())")
    @Mapping(source = "parent.phoneNumber", target = "contactNumber")
    @Mapping(source = "relationshipType", target = "relationshipType")
    StudentParentDto toDto(StudentParent entity);
}
