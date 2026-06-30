package com.mtp.school.cqrs.mappers;

import com.mtp.school.cqrs.commands.CreateExtracurricularCommand;
import com.mtp.school.cqrs.dto.ExtracurricularQueryResultDto;
import com.mtp.school.models.Extracurricular;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExtracurricularMapper {
    @Mapping(target = "id", ignore = true)
    Extracurricular toEntity(CreateExtracurricularCommand command);

    ExtracurricularQueryResultDto toDto(Extracurricular entity);
}
