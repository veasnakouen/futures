package com.mtp.clinic.cqrs.mappers;

import com.mtp.clinic.cqrs.commands.CreateProviderCommand;
import com.mtp.clinic.cqrs.dto.ProviderQueryResultDto;
import com.mtp.clinic.models.Provider;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProviderMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    Provider toEntity(CreateProviderCommand command);

    ProviderQueryResultDto toDto(Provider entity);
}
