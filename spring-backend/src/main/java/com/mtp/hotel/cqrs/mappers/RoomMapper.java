package com.mtp.hotel.cqrs.mappers;

import com.mtp.hotel.cqrs.commands.CreateRoomCommand;
import com.mtp.hotel.cqrs.dto.RoomQueryResultDto;
import com.mtp.hotel.models.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoomMapper {
    @Mapping(target = "id", ignore = true)
    Room toEntity(CreateRoomCommand command);

    RoomQueryResultDto toDto(Room entity);
}
        