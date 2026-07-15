package com.mtp.hotel.cqrs.mappers;

import com.mtp.hotel.cqrs.commands.CreateHousekeepingTaskCommand;
import com.mtp.hotel.cqrs.dto.HousekeepingTaskQueryResultDto;
import com.mtp.hotel.models.HousekeepingTask;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HousekeepingTaskMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "room", ignore = true)
    HousekeepingTask toEntity(CreateHousekeepingTaskCommand command);

    @Mapping(source = "room.id", target = "roomId")
    HousekeepingTaskQueryResultDto toDto(HousekeepingTask entity);
}
