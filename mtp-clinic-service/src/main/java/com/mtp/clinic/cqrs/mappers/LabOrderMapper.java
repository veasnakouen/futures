package com.mtp.clinic.cqrs.mappers;

import com.mtp.clinic.cqrs.commands.CreateLabOrderCommand;
import com.mtp.clinic.cqrs.dto.LabOrderQueryResultDto;
import com.mtp.clinic.models.LabOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LabOrderMapper {
    @Mapping(target = "id", ignore = true)
    LabOrder toEntity(CreateLabOrderCommand command);

    LabOrderQueryResultDto toDto(LabOrder entity);
}
