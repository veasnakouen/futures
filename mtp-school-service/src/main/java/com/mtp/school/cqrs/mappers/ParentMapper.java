package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.commands.CreateParentCommand;
import com.mtp.school.cqrs.dto.ParentQueryResultDto;
import com.mtp.school.models.Parent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ParentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "firstName", expression = "java(command.getName() != null && command.getName().contains(\" \") ? command.getName().substring(0, command.getName().indexOf(\" \")) : command.getName())")
    @Mapping(target = "lastName", expression = "java(command.getName() != null && command.getName().contains(\" \") ? command.getName().substring(command.getName().indexOf(\" \") + 1) : \"\")")
    @Mapping(target = "phoneNumber", source = "contactNumber")
    Parent toEntity(CreateParentCommand command);

    @Mapping(target = "name", expression = "java((entity.getFirstName() != null ? entity.getFirstName() : \"\") + (entity.getLastName() != null && !entity.getLastName().isEmpty() ? \" \" + entity.getLastName() : \"\"))")
    @Mapping(target = "contactNumber", source = "phoneNumber")
    ParentQueryResultDto toDto(Parent entity);
}
