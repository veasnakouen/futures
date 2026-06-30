package com.mtp.hotel.cqrs.mappers;

import com.mtp.hotel.cqrs.commands.CreateGuestCommand;
import com.mtp.hotel.cqrs.dto.GuestQueryResultDto;
import com.mtp.hotel.models.Guest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GuestMapper {
    @Mapping(target = "id", ignore = true)
    Guest toEntity(CreateGuestCommand command);

    GuestQueryResultDto toDto(Guest entity);
}
