package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.dto.BranchQueryResultDto;
import com.mtp.school.models.Branch;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BranchMapper {
    @org.mapstruct.Mapping(target = "id", ignore = true)
    Branch toEntity(com.mtp.school.cqrs.commands.CreateBranchCommand command);
    
    @org.mapstruct.Mapping(target = "id", ignore = true)
    Branch toEntity(com.mtp.school.cqrs.commands.UpdateBranchCommand command);

    @org.mapstruct.Mapping(target = "id", ignore = true)
    @org.mapstruct.Mapping(target = "tenantId", ignore = true)
    @org.mapstruct.Mapping(target = "students", ignore = true)
    @org.mapstruct.Mapping(target = "teachers", ignore = true)
    @org.mapstruct.Mapping(target = "courses", ignore = true)
    @org.mapstruct.Mapping(target = "staff", ignore = true)
    void updateEntity(com.mtp.school.cqrs.commands.UpdateBranchCommand command, @org.mapstruct.MappingTarget Branch entity);

    BranchQueryResultDto toDto(Branch entity);
}